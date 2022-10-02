import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { promises as fsPromises } from "fs";

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
      item: any[];
    };
  };
}

const parseAndAdd = async () => {
  const parser = new XMLParser();

  const xmlFile = await fsPromises.readFile("test.xml", "utf8");
  let parseJob: Podcast = parser.parse(xmlFile);

  const itemList = parseJob.rss.channel.item;
  console.log("🚀 ~ file: parser.ts ~ line 33 ~ itemList", itemList);
  itemList.forEach((item) => console.log(item));

  const newPodFile = parseJob;

  const builder = new XMLBuilder({});
  const xmlOutput = builder.build(newPodFile);
  fsPromises.writeFile("newOutput.xml", xmlOutput);
};

parseAndAdd();
