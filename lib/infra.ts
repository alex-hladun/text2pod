import { Duration } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class Infra extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const infraFunction = new NodejsFunction(this, "function", {
      environment: {
        FLUENTFFMPEG_COV: "",
        FFMPEG_PATH: "/opt/bin/ffmpeg",
        FFPROBE_PATH: "/opt/bin/ffmpeg",
      },
      timeout: Duration.seconds(60 * 10),
      memorySize: 1024,
    });
    new LambdaRestApi(this, "apigw", {
      handler: infraFunction,
    });
  }
}
