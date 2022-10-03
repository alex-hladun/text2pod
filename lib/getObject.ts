const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const client = new S3Client(); // Pass in opts to S3 if necessary

export function getObject(Bucket: string, Key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const getObjectCommand = new GetObjectCommand({ Bucket, Key });

    try {
      const response = await client.send(getObjectCommand);

      // Store all of data chunks returned from the response data stream
      // into an array then use Array#join() to use the returned contents as a String
      let responseDataChunks: string[] = [];

      // Handle an error while streaming the response body
      response.Body.once("error", (err: Error) => reject(err));

      // Attach a 'data' listener to add the chunks of data to our array
      // Each chunk is a Buffer instance
      response.Body.on("data", (chunk: string) =>
        responseDataChunks.push(chunk)
      );

      // Once the stream has no more data, join the chunks into a string and return the string
      response.Body.once("end", () => resolve(responseDataChunks.join("")));
    } catch (err) {
      // Handle the error or throw
      return reject(err);
    }
  });
}
