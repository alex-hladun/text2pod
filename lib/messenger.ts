import { PinpointClient, SendMessagesCommand } from "@aws-sdk/client-pinpoint";
import { config } from "./config";
console.log("🚀 ~ file: messenger.ts ~ line 3 ~ config", config);

const pinpointClient = new PinpointClient({});

export const message = async (number: string, message: string) => {
  const command = new SendMessagesCommand({
    ApplicationId: "6a22db7c3faa437099752474cbf54170",
    MessageRequest: {
      Addresses: {
        [number]: {
          BodyOverride: message,
          ChannelType: "SMS"
        }
      },
      MessageConfiguration: {
        SMSMessage: {
          Body: message,
          // Keyword: registeredKeyword,
          MessageType: "TRANSACTIONAL",
          OriginationNumber: "+19029036694"
          // SenderId: senderId
        }
      }
    }
  });

  try {
    await pinpointClient.send(command);
    console.log("sending messaage complete");
  } catch (e) {
    console.log("🚀 ~ file: message.ts ~ line 38 ~ message ~ e", e);
  }
};

// message("+14036159778", "Hi Carter I love you");
