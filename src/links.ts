import * as dotenv from "dotenv";
import originalGot from "got";

interface TrackingLink {
  _id: string;
  type: string;
  src: string;
}

interface Link {
  trackingLinks: TrackingLink[];
}

interface ImpressionByTrackingLinkId {
  trackingLinkId: string;
  impression: number;
}

dotenv.config({
  path: [".env.local", ".env"],
});

const got = originalGot.extend({
  prefixUrl: process.env.API_ORIGIN + "/",
});

export function getLinks() {
  return got.get("links").json<Link[]>();
}

export function getTrackingLinks() {
  return getLinks().then((res) => res.flatMap((link) => link.trackingLinks));
}

export function insertImpressionsByTrackingLinkIds(
  impressionsWithTrackingLinkIds: ImpressionByTrackingLinkId[]
) {
  return got.post(`links/impressionsByTrackingLinkIds`, {
    json: {
      impressionsWithTrackingLinkIds: impressionsWithTrackingLinkIds,
    },
  });
}
