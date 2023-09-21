import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  bucketName: process.env.bucketName || "hladun-site",
  bucketRegion: "us-west-2",
  podcastFile: process.env.podcastFileName || "pod2.rss",
  originationNumber: process.env.originationNumber || "+19029036694",
  pinpointApplicationId:
    process.env.pinpointApplicationId || "6a22db7c3faa437099752474cbf54170",
};

export const ytRegExp = new RegExp(
  "^(https?://)?(www.youtube.com|youtu.be)/.+$"
);
