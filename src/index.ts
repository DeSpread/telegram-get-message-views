import bigInt from "big-integer";
import * as dotenv from "dotenv";
import { getTrackingLinks } from "./links.js";
import { getChannelId, getMessagesViews } from "./telegram/api.js";

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
        );

        return links.map((link) => ({
          trackingLinkId: link.trackingLinkId,
          views: views.find((viewObj) => viewObj.msgId === link.messageId)!
            .views,
        }));
      })
    )
  )
  .then((views) => views.flat())
  .then(console.log);
