const fs = require("fs");

const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

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

  const saveDirectory = `/tmp/${relevantDetails.videoId}.mp3`;

  return new Promise((resolve, reject) => {
    ffmpeg(ytdlStream)
      .audioBitrate(320)
      .on("error", function (err) {
        console.log("🚀 ~ file: downloadAudio.ts ~ line 38 ~ err", err);
        reject(err);
      })
      .save(saveDirectory)
      .on("end", async () => {
        console.log(`Download complete ✅. Uploading...`);
        const readStream = fs.createReadStream(saveDirectory);

        const parallelUploads3 = new Upload({
          client: new S3Client({}),
          params: {
            Bucket: "hladun-site",
            Key: `pod/${relevantDetails.videoId}.mp3`,
            Body: readStream
          },
          leavePartsOnError: false // optional manually handle dropped parts
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
