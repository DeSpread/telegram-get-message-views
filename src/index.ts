import bigInt from "big-integer";
import * as dotenv from "dotenv";
import {
  getTrackingLinks,
  insertImpressionsByTrackingLinkIds,
} from "./links.js";
import { getChannelId, getMessagesViews } from "./telegram/api.js";
import { exec } from "@actions/exec";

dotenv.config({
  path: [".env.local", ".env"],
});

function groupBy<T extends Record<string, any>>(xs: T[], key: keyof T) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {} as Record<T[keyof T], Array<T>>);
}

const links = getTrackingLinks().then((links) =>
  links.filter((link) => link.type === "TELEGRAM")
);

let failedLinks: string[] = [];

links
  .then((links) => {
    const srcList = links.map((link) => link.src);

    return Promise.all(
      srcList.map(async (src, i) => {
        if (src.includes("https://t.me/c/")) {
          return {
            trackingLinkId: links[i]._id,
            channeId: bigInt(`-100${src.split("/")[4]}`),
            messageId: parseInt(src.split("/")[5]),
          };
        } else {
          const channelId = await getChannelId(src.split("/")[3]);

          return {
            trackingLinkId: links[i]._id,
            channeId: channelId,
            messageId: parseInt(src.split("/")[4]),
          };
        }
      })
    );
  })
  .then((links) => groupBy(links, "channeId"))
  .then((channelLinksMap) =>
    Promise.all(
      Object.entries(channelLinksMap).map(async ([channelId, links]) => {
        const views = await getMessagesViews(
          bigInt(channelId),
          links.map((link) => link.messageId)
        ).catch((err) => {
          console.error("invalid error where getMessagesViews");
          console.error("channelId - ", channelId);
          console.error("links - ", links);
          throw err;
        });

        return links.map((link) => ({
          trackingLinkId: link.trackingLinkId,
          impression: views.find((viewObj) => viewObj.msgId === link.messageId)
            ?.views,
        }));
      })
    )
  )
  .then((views) => views.flat())
  .then((views) =>
    views.filter<{ trackingLinkId: string; impression: number }>(
      (data): data is { trackingLinkId: string; impression: number } => {
        const isNumber = typeof data.impression === "number";
        if (!isNumber) {
          failedLinks.push(data.trackingLinkId);
        }
        return isNumber;
      }
    )
  )
  .then((data) => insertImpressionsByTrackingLinkIds(data))
  .then(() => {
    const result = { failedLinks };
    console.log(JSON.stringify(result, undefined, 2));
    exec(`echo "RESULT=${JSON.stringify(result)}" >> $GITHUB_OUTPUT`);
  })
  .then(() => process.exit());
