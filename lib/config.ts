export const config = {
  bucketName: "bucket-name",
  bucketRegion: "us-west-2",
  podcastFile: "pod.rss",
  originationNumber: "+55555555555",
  pinpointApplicationId: "XYXYXYXYXYYXYXYX",
  messageType: "TRANSACTIONAL",
};

export const ytRegExp = new RegExp(
  "^(https?://)?(www.youtube.com|youtu.be)/.+$"
);
