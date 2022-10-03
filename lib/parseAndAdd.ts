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
  "itunes:duration": string;
}
export const parseAndAdd = async (episode: PodEpisode) => {
  const podFile = await getObject(config.bucketName, config.podcastFile); // Get existing podcast feed

  // const podFile = await fsPromises.readFile("test.xml", "utf8"); //Load local file

  const parser = new XMLParser({ ignoreAttributes: false });
  let parseJob: Podcast = parser.parse(podFile);

  const itemList = parseJob.rss.channel.item;

  // Write to S3
  const newItemList = [...itemList, episode];
  const newPodFile = {
    ...parseJob,
    rss: {
      ...parseJob.rss,
      channel: { ...parseJob.rss.channel, item: newItemList }
    }
  };

  const builder = new XMLBuilder({ ignoreAttributes: false });
  const xmlOutput = builder.build(newPodFile);

  await putObject(config.bucketName, config.podcastFile, xmlOutput); // Write file to S3
  // Write file locally
  // fsPromises.writeFile("pod2.rss", xmlOutput);
};
