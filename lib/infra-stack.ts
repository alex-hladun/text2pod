import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Infra } from "./infra";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new Infra(this, "infra");
  }
}
