import got from "got";

interface TrackingLink {
  _id: string;
  type: string;
  src: string;
}

interface Link {
  trackingLinks: TrackingLink[];
}

export function getLinks() {
  return got.get("http://localhost:3100/links").json<Link[]>();
}

export function getTrackingLinks() {
  return getLinks().then((res) => res.flatMap((link) => link.trackingLinks));
}
