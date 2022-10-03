import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { ytRegExp } from "./config";
import { parseAndAdd, PodEpisode } from "./parser";
import { streamAudio } from "./streamAudio";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
  console.log(`ProcessENV: ${JSON.stringify(process.env)}`);

  let url = event?.url;
  const record = event.Records[0];
  console.log("🚀 ~ file: infra.function.ts ~ line 15 ~ record", record);
  let originationNumber = "";
  if (record?.Sns.Message && typeof record.Sns.Message === "string") {
    const parsedMessage = JSON.parse(record.Sns.Message);
    const messageBody = parsedMessage.messageBody;
    console.log(
      "🚀 ~ file: infra.function.ts ~ line 20 ~ messageBody",
      messageBody
    );
    originationNumber = parsedMessage.originationNumber;
    if (messageBody && ytRegExp.test(messageBody)) {
      url = messageBody;
    }
  }

  console.log("🚀 ~ file: infra.function.ts ~ line 27 ~ url", url);

  try {
    if (!url) throw new Error("Invalid Url");
    const details = await streamAudio(url);
    console.log("🚀 ~ file: infra.function.ts ~ line 36 ~ details", details);
    const { title, description, videoId, lengthSeconds, ownerChannelName } =
      details;

    const newRecord: PodEpisode = {
      title: `${ownerChannelName} | ${title}`,
      "itunes:summary": description,
      "itunes:duration": lengthSeconds,
      "itunes:author": ownerChannelName,
      guid: videoId,
      "itunes:subtitle": "",
      "itunes:image": {
        "@_href": ``
      },
      pubDate: new Date().toUTCString(),
      enclosure: {
        "@_url": `https://hladun-site.s3-us-west-2.amazonaws.com/pod/${videoId}.mp3`,
        "@_length": `${lengthSeconds}`,
        "@_type": "audio/mpeg"
      }
    };

    await parseAndAdd(newRecord);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "SUCCESS",
        videoId
      })
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: error
      })
    };
  }
};
