import { Duration } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as sns from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";
import * as dotenv from "dotenv";
import * as iam from "aws-cdk-lib/aws-iam";

dotenv.config();
export class Aps extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const emailSnsTopic = new sns.Topic(this, "emailSnsTopic");

    const apsEmailFunction = new NodejsFunction(this, "email", {
      timeout: Duration.seconds(60 * 10),
      memorySize: 512,
      environment: {
        SNS_ARN: emailSnsTopic.topicArn,
      },
    });

    new LambdaRestApi(this, "apigw", {
      handler: apsEmailFunction,
    });

    const snsTopicPolicy = new iam.PolicyStatement({
      actions: ["sns:publish"],
      resources: ["*"],
    });

    apsEmailFunction.addToRolePolicy(snsTopicPolicy);
  }
}
