# Using AWS X-Ray with Amazon EventBridge

This example application shows how to use AWS X-Ray with Amazon EventBridge, using the AWS Serverless Application Model (AWS SAM).

To learn more about how this sample works, see AWS Compute Blog post: https://aws.amazon.com/blogs/compute/using-aws-x-ray-tracing-with-amazon-eventbridge/

Important: this application uses various AWS services and there are costs associated with these services after the Free Tier usage - please see the [AWS Pricing page](https://aws.amazon.com/pricing/) for details. You are responsible for any AWS costs incurred. No warranty is implied in this example.

```bash
.
├── README.MD          <-- This instructions file
├── xray-layer         <-- Source code for X-Ray layer
├── webhook            <-- Source code for the webhook (event producer)
├── targets-lambda     <-- Source code for the Lambda event consumer
├── targets-sfn        <-- Source code for the Step Functions event consumer
```

## Requirements

* AWS CLI already configured with Administrator permission
* [AWS SAM CLI installed](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) - minimum version 0.48.
* [NodeJS 16.x installed](https://nodejs.org/en/download/)

## Installation Instructions

1. [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) if you do not already have one and login.

1. Clone the repo onto your local development machine using `git clone`.

1. Change into the repo's directory.

## Deploy the webhook

1. Run:

```
cd ./webhook
sam build
sam deploy --guided
```
When prompted for parameters, enter:
- Stack Name: eventbridge-xray-webhook
- AWS Region: your preferred AWS Region (e.g. us-east-1)
- Accept all other defaults.

2. Note the API endpoint created by the template.

3. Test the API webhook using [curl](https://curl.se/) or [Postman](https://www.postman.com/). The endpoint accepts a query parameter that is stored in the event before being put on the event bus. The following query parameter options are valid:

- Routes to the Lambda consumer: https://YOUR-API-ID.execute-api.sa-east-1.amazonaws.com/Prod?target=lambda
- Routes to the Step Functions consumer: https://YOUR-API-ID.execute-api.sa-east-1.amazonaws.com/Prod?target=sfn
- Routes to an API Gateway consumer: https://YOUR-API-ID.execute-api.sa-east-1.amazonaws.com/Prod?target=apigw

## Deploy and test the Lambda consumer

1. Run:

```
cd ./targets-lambda
sam build
sam deploy --guided
```
When prompted for parameters, enter:
- Stack Name: eventbridge-xray-target-lambda
- AWS Region: your preferred AWS Region (e.g. us-east-1)
- Accept all other defaults.

2. Route an event to the Lambda consumer by using curl or Postman to invoke the webhook:

- https://YOUR-API-ID.execute-api.sa-east-1.amazonaws.com/Prod?target=lambda

3. Open the [X-Ray console](console.aws.amazon.com/xray/home), select *Traces* from the menu, and select the most recent trace to view the the request from webhook through to Lambda.

## Deploy and test the Step Functions consumer

1. Run:

```
cd ./targets-sfn
sam build
sam deploy --guided
```
When prompted for parameters, enter:
- Stack Name: eventbridge-xray-target-step-functions
- AWS Region: your preferred AWS Region (e.g. us-east-1)
- Accept all other defaults.

2. Route an event to the Lambda consumer by using curl or Postman to invoke the webhook:

- https://YOUR-API-ID.execute-api.sa-east-1.amazonaws.com/Prod?target=sfn

3. Open the [X-Ray console](console.aws.amazon.com/xray/home), select *Traces* from the menu, and select the most recent trace to view the the request from webhook through to Step Functions.

## Create a Lambda layer with the X-Ray SDK

You can create a Lambda layer containing the X-Ray SDK, making it easier to add the SDK to existing Lambda functions:

1. Run:

```
cd ./aws-xray-sdk-layer
npm install
mkdir ./layer/nodejs –p
mv ./node_modules ./layer/nodejs
```
2.	Next, deploy the AWS SAM template to create the layer:
sam deploy --guided

When prompted for parameters, enter:
- Stack Name: AWS SDK layer
- AWS Region: your preferred AWS Region (e.g. us-east-1)
- Accept all other defaults.

3.	After the deployment completes, the new Lambda layer is available to use. Run this command to see the available layers:

```
aws lambda list-layers
```

## Next steps

The AWS Compute Blog post at the top of this README file contains additional information about the how to use Lambda layers.

If you have any questions, please raise an issue in the GitHub repo.

==============================================

Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.

SPDX-License-Identifier: MIT-0
