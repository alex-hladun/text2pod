const fs = require("fs");

import * as ytdl from "ytdl-core";

export const downloadAudio = async (url: string, title: string) => {
  const videoInfo = await ytdl.getInfo(url);

  const relevantDetails = {
    title: videoInfo.videoDetails.title,
    description: videoInfo.videoDetails.description,
    videoId: videoInfo.videoDetails.videoId,
    lengthSeconds: videoInfo.videoDetails.lengthSeconds,
    ownerChannelName: videoInfo.videoDetails.ownerChannelName
  };
  console.log(
    "🚀 ~ file: downloadAudio.ts ~ line 15 ~ relevantDetails",
    relevantDetails
  );

  ytdl(url, {
    filter: "audioonly",
    quality: "highestaudio"
  }).pipe(fs.createWriteStream("test.mp3"));
};

const testUrl = "https://www.youtube.com/watch?v=YnwfTHpnGLY";
downloadAudio(testUrl, "test");
