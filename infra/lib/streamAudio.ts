const fs = require("fs");

const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegStatic = require("ffmpeg-static");
const ffprobeStatic = require("ffprobe-static");

import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";

console.log("🚀 ~ file: streamAudio.ts ~ line 37 ~ ffmpegStatic", ffmpegStatic);
console.log(
  "🚀 ~ file: streamAudio.ts ~ line 39 ~ ffprobeStatic.path",
  ffprobeStatic.path
);

export const streamAudio = async (url: string, overrideTitle?: string) => {
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

  return new Promise((resolve, reject) => {
    ffmpeg(ytdlStream)
      .setFfmpegPath(ffmpegStatic)
      .setFfprobePath(ffprobeStatic.path)
      .audioBitrate(320)
      .on("error", function (err) {
        console.log("🚀 ~ file: downloadAudio.ts ~ line 38 ~ err", err);
        reject(err);
      })
      .save(`./${relevantDetails.videoId}.mp3`)
      .on("end", async () => {
        console.log(`Download complete ✅. Uploading...`);
        const readStream = fs.createReadStream(
          `./${relevantDetails.videoId}.mp3`
        );

        const parallelUploads3 = new Upload({
          client: new S3Client({}),
          params: {
            Bucket: "hladun-site",
            Key: `pod/${relevantDetails.videoId}.mp3`,
            Body: readStream
          },
          leavePartsOnError: false // optional manually handle dropped parts
        });

        parallelUploads3.on("httpUploadProgress", (progress) => {
          console.log(progress);
        });
        await parallelUploads3.done();
        console.log("Upload complete ✅");
        resolve("Upload complete ✅");
      });
  });
};

const args = process.argv.slice(2);
if (args[0] === "local") {
  console.log("🚀 ~ file: streamAudio.ts ~ line 9 ~ args", args);
  streamAudio(
    "https://www.youtube.com/watch?v=Uq9gPaIzbe8&ab_channel=SamSmithVEVO"
  );
}
