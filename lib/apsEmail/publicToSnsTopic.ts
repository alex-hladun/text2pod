import { PublishCommand, PublishInput, SNSClient } from "@aws-sdk/client-sns";
import * as dotenv from "dotenv";

dotenv.config();
const TopicArn = process.env.TopicArn;

export const publishToSnsTopic = async (body: string) => {
  try {
    // new SNS client
    const snsClient = new SNSClient({ region: "us-west-2" });

    const input: PublishInput = {
      TopicArn: TopicArn,
      Message: JSON.stringify(body), // required
      Subject: "APS_EMAIL",
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

// publishToSnsTopic("this is a full test {this: test}");
