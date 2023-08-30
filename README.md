# text2pod

This is a project to upload and append audio files from YouTube to a podcast stored in AWS S3. To set up:

1. Set up aws-cli and install dependencies.
2. Create an S3 bucket, copy pod.rss into bucket, and add details to `/lib/config.ts`
3. Set up AWS pinpoint application, and add applicationId and originationNumber to config.ts

- To test, run `npx ts-node streamAudio.ts`

5. If deploying to AWS, add FFMPEG binary layer from [here](https://github.com/serverlesspub/ffmpeg-aws-lambda-layer).
6. To deploy, run `cdk deploy`

## CDK commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## FFMPEG Binary

FFMPEG Runtime: https://github.com/serverlesspub/ffmpeg-aws-lambda-layer

## To-do:

- Add automation of binary layer download during deploy.
- Add cdk to generate bucket, pod.rss, and pinpoint application / resources.
