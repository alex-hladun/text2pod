import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  bucketName: process.env.bucketName,
  bucketRegion: "us-west-2",
  podcastFile: "pod2.rss",
  originationNumber: process.env.originationNumber,
  pinpointApplicationId: process.env.pinpointApplicationId,
  messageType: "TRANSACTIONAL",
};

export const ytRegExp = new RegExp(
  "^(https?://)?(www.youtube.com|youtu.be)/.+$"
);
