import { PublishCommand, PublishInput, SNSClient } from "@aws-sdk/client-sns";

const TopicArn = "arn:aws:sns:us-east-1:253896803446:APSEmailForm";

export const publishToSnsTopic = async (body: string) => {
  try {
    // new SNS client
    const snsClient = new SNSClient({});

    const input: PublishInput = {
      // PublishInput
      TopicArn: TopicArn,
      //   TargetArn: "STRING_VALUE",
      //   PhoneNumber: "STRING_VALUE",
      Message: JSON.stringify(body), // required
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

console.log("before");
publishToSnsTopic("this is a full test {this: test}");
