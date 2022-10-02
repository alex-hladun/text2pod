import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { streamAudio } from "./streamAudio";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const testUrl =
    "https://www.youtube.com/watch?v=Uq9gPaIzbe8&ab_channel=SamSmithVEVO";

  try {
    await streamAudio(testUrl);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "hello from lambda"
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
