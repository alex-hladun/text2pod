const fs = require("fs");

import * as ytdl from "ytdl-core";
import * as ffmpeg from "fluent-ffmpeg";
const stream = require("stream");

export const downloadAudio = async (url: string, overrideTitle?: string) => {
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

  const ytdlStream = ytdl(url, {
    filter: "audioonly",
    quality: "highestaudio"
  });

  console.log(`Downloading ${overrideTitle || relevantDetails.title}...`);

  ffmpeg(ytdlStream)
    .audioBitrate(320)
    .save(`./${overrideTitle || relevantDetails.title}.mp3`)
    .on("error", function (err) {
      console.log("🚀 ~ file: downloadAudio.ts ~ line 38 ~ err", err);
    })
    .on("end", () => {
      console.log(`Download complete ✅`);
      console.log(`Upload to S3...`);
    });
};

const testUrl = "https://www.youtube.com/watch?v=98JGfgnXE1E";
downloadAudio(testUrl);
