import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { config } from "./config";
import { getObject } from "./getObject";
import { promises as fsPromises } from "fs";
import { putObject } from "./putObject";

export interface Podcast {
  rss: {
    channel: {
      title: string;
      link: string;
      language: string;
      copyright: string;
      "itunes:subtitle": string;
      "itunes:author": string;
      "itunes:summary": string;
      "itunes:owner": any;
      "itunes:image": any;
      "itunes:category": string;
      item: PodEpisode[];
    };
  };
}

export interface PodEpisode {
  title: string;
  "itunes:author": string;
  "itunes:subtitle": string;
  "itunes:summary": string;
  "itunes:image": {
    "@_href": string;
  };
  enclosure: {
    "@_url": string;
    "@_length": string;
    "@_type": string;
  };
  guid: string;
  pubDate: string;
  // pubDate: 'Wed Aug 11 2021 22:36:13 GMT-0700 (Mountain Standard Time)',
  "itunes:duration": string;
}
export const parseAndAdd = async (episode: PodEpisode) => {
  const podFile = await getObject(config.bucketName, config.podcastFile);
  console.log("🚀 ~ file: parser.ts ~ line 39 ~ podFile", podFile);

  // Local podFile
  // const podFile = await fsPromises.readFile("test.xml", "utf8");

  const parser = new XMLParser({ ignoreAttributes: false });
  let parseJob: Podcast = parser.parse(podFile);

  const itemList = parseJob.rss.channel.item;
  console.log("🚀 ~ file: parser.ts ~ line 48 ~ itemList", itemList);

  // Write to S3
  const newItemList = [...itemList, episode];
  const newPodFile = {
    ...parseJob,
    rss: {
      ...parseJob.rss,
      channel: { ...parseJob.rss.channel, item: newItemList }
    }
  };
  console.log("🚀 ~ file: parser.ts ~ line 62 ~ newPodFile", newPodFile);
  const builder = new XMLBuilder({ ignoreAttributes: false });
  const xmlOutput = builder.build(newPodFile);
  // Write file locally
  // fsPromises.writeFile("pod2.rss", xmlOutput);

  // write to S3
  await putObject(config.bucketName, config.podcastFile, xmlOutput);
};
