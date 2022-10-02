import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

export class Infra extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const infraFunction = new NodejsFunction(this, "function");
    new LambdaRestApi(this, "apigw", {
      handler: infraFunction
    });
  }
}
