import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { promises as fsPromises } from "fs";
import {
  S3Client,
  AbortMultipartUploadCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import { getObject } from "./getObject";
import { putObject } from "./putObject";

interface Podcast {
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

interface PodEpisode {
  title: string;
  "itunes:author": string;
  "itunes:subtitle": string;
  "itunes:summary": string;
  "itunes:image": string;
  enclosure: string;
  guid: string;
  pubDate: string;
  // pubDate: 'Wed Aug 11 2021 22:36:13 GMT-0700 (Mountain Standard Time)',
  "itunes:duration": string;
}
const parseAndAdd = async (videoUrl?: string) => {
  const podFile = await getObject("hladun-site", "pod.xml");
  // Local podFile
  // const podFile = await fsPromises.readFile("test.xml", "utf8");

  const parser = new XMLParser();
  let parseJob: Podcast = parser.parse(podFile);

  const itemList = parseJob.rss.channel.item;
  itemList.forEach((item) => console.log(item));

  const newPodFile = parseJob;

  const builder = new XMLBuilder({});
  const xmlOutput = builder.build(newPodFile);

  // Write file locally
  // fsPromises.writeFile("newOutput.xml", xmlOutput);

  await putObject("hladun-site", "pod2.xml", xmlOutput);
};

parseAndAdd();
