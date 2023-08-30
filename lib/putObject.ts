const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const client = new S3Client(); // Pass in opts to S3 if necessary

export function putObject(
  Bucket: string,
  Key: string,
  Body: string | Uint8Array | Buffer
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const putObjectCommand = new PutObjectCommand({
      Bucket,
      Key,
      Body,
    });

    try {
      await client.send(putObjectCommand);
      resolve("ok");
    } catch (err) {
      console.log("🚀 ~ file: putObject.ts ~ line 22 ~ err", err);
      // Handle the error or throw
      return reject(err);
    }
  });
}
