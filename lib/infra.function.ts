import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ytRegExp } from "./config";
import { message } from "./messenger";
import { parseAndAdd, PodEpisode } from "./parseAndAdd";
import { streamAudio } from "./streamAudio";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  let url = event?.url;
  const record = event.Records[0];

  let originationNumber = "";
  if (record?.Sns.Message && typeof record.Sns.Message === "string") {
    const parsedMessage = JSON.parse(record.Sns.Message);
    const messageBody = parsedMessage.messageBody;
    originationNumber = parsedMessage.originationNumber;
    if (messageBody && ytRegExp.test(messageBody)) {
      url = messageBody;
    }
  }

  try {
    if (!url) throw new Error("Invalid Url");
    const details = await streamAudio(url);

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

    await message(
      originationNumber,
      `Successfully downloaded ${title}. Will appear in the podcast feed shortly.`
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "SUCCESS",
        videoId
      })
    };
  } catch (error) {
    await message(
      originationNumber,
      "There was a problem downloading :( Ensure you're sending a valid YouTube URL."
    );
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: error
      })
    };
  }
};
