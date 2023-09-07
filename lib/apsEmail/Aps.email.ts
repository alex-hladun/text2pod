import { PublishCommand, PublishInput, SNSClient } from "@aws-sdk/client-sns";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";

const TopicArn = "arn:aws:sns:us-east-1:253896803446:APSEmailForm";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  try {
    // new SNS client
    const snsClient = new SNSClient({});

    const input: PublishInput = {
      // PublishInput
      TopicArn,
      //   TargetArn: "STRING_VALUE",
      //   PhoneNumber: "STRING_VALUE",
      Message: JSON.stringify(event), // required
      Subject: "APS_EMAIL",
      //   MessageStructure: "STRING_VALUE",
      //   MessageAttributes: {
      //     // MessageAttributeMap
      //     "<keys>": {
      //       // MessageAttributeValue
      //       DataType: , // required
      //       StringValue: "STRING_VALUE",
      //       BinaryValue: "BLOB_VALUE",
      //     },
      //   },
      MessageDeduplicationId: "STRING_VALUE",
      MessageGroupId: "STRING_VALUE",
    };
    const command = new PublishCommand(input);
    const response = await snsClient.send(command);
    console.log("🚀 ~ file: Aps.email.ts:39 ~ response:", response);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "SUCCESS",
      }),
    };
  } catch (error) {
    console.log("🚀 ~ file: Aps.email.ts:47 ~ error:", error);
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: error,
      }),
    };
  }
};
