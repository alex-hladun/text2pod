import { PublishCommand, PublishInput, SNSClient } from "@aws-sdk/client-sns";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { publishToSnsTopic } from "./publicToSnsTopic";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  return publishToSnsTopic(JSON.stringify(event.body));
};
