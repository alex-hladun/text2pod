import { PinpointClient, SendMessagesCommand } from "@aws-sdk/client-pinpoint";
import { config } from "./config";

const pinpointClient = new PinpointClient({});

export const message = async (number: string, message: string) => {
  const command = new SendMessagesCommand({
    ApplicationId: config.pinpointApplicationId,
    MessageRequest: {
      Addresses: {
        [number]: {
          BodyOverride: message,
          ChannelType: "SMS",
        },
      },
      MessageConfiguration: {
        SMSMessage: {
          Body: message,
          MessageType: "TRANSACTIONAL",
          OriginationNumber: config.originationNumber,
        },
      },
    },
  });

  try {
    await pinpointClient.send(command);
    console.log("sending messaage complete");
  } catch (e) {
    console.log("🚀 ~ file: message.ts ~ line 38 ~ message ~ e", e);
  }
};
