import { Duration } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class Aps extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const apsEmail = new NodejsFunction(this, "email", {
      timeout: Duration.seconds(60 * 10),
      memorySize: 512,
    });
    new LambdaRestApi(this, "apigw", {
      handler: apsEmail,
    });
  }
}
