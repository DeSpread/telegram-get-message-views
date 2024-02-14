import * as dotenv from "dotenv";
import got from "got";

interface TrackingLink {
  _id: string;
  type: string;
  src: string;
}

interface Link {
  trackingLinks: TrackingLink[];
}

dotenv.config({
  path: [".env.local", ".env"],
});

export function getLinks() {
  return got.get(`${process.env.API_ORIGIN}/links`).json<Link[]>();
}

export function getTrackingLinks() {
  return getLinks().then((res) => res.flatMap((link) => link.trackingLinks));
}
