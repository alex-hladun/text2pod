import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";

export class Infra extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const infraFunction = new NodejsFunction(this, "function", {
      environment: {
        FLUENTFFMPEG_COV: ""
      },
      timeout: Duration.seconds(300)
    });
    new LambdaRestApi(this, "apigw", {
      handler: infraFunction
    });
  }
}
