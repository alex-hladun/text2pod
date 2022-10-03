export const config = {
  bucketName: "hladun-site",
  bucketRegion: "us-west-2",
  podcastFile: "pod2.rss",
  originationNumber: "+19029036694",
  pinpointApplicationId: "6a22db7c3faa437099752474cbf54170",
  messageType: "TRANSACTIONAL"
};

export const ytRegExp = new RegExp(
  "^(https?://)?(www.youtube.com|youtu.be)/.+$"
);
