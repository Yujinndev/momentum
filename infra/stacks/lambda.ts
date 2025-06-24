import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import * as archive from '@pulumi/archive'
import { lambdaBucket } from './s3'

const config = new pulumi.Config()
const databaseUrl = config.requireSecret('DATABASE_URL')

const assumeRole = aws.iam.getPolicyDocument({
  statements: [
    {
      effect: 'Allow',
      principals: [
        {
          type: 'Service',
          identifiers: ['lambda.amazonaws.com'],
        },
      ],
      actions: ['sts:AssumeRole'],
    },
  ],
})

const iamForLambda = new aws.iam.Role('iam-for-lambda', {
  name: 'iam-for-lambda',
  assumeRolePolicy: assumeRole.then((assumeRole) => assumeRole.json),
})

const lambda = archive.getFile({
  type: 'zip',
  sourceDir: 'dist',
  outputPath: 'zips/lambda-reset-budgets.zip',
})

const lambdaZipObject = lambda.then(
  (lambdaArchive) =>
    new aws.s3.BucketObject('lambda-zip-object', {
      bucket: lambdaBucket.bucket,
      key: 'lambda-reset-budgets.zip',
      source: new pulumi.asset.FileAsset(lambdaArchive.outputPath),
      contentType: 'application/zip',
    })
)

const lambdaFunction = pulumi
  .all([lambdaBucket.bucket, lambdaZipObject, lambda])
  .apply(([bucket, zipObj, lambdaArchive]) => {
    return new aws.lambda.Function('lambda-reset-budgets', {
      s3Bucket: bucket,
      s3Key: zipObj.key,
      name: 'lambda-reset-budgets',
      role: iamForLambda.arn,
      handler: 'reset-budgets-handler.handler',
      sourceCodeHash: lambdaArchive.outputBase64sha256,
      runtime: aws.lambda.Runtime.NodeJS18dX,
      environment: {
        variables: {
          DATABASE_URL: databaseUrl,
        },
      },
    })
  })

const cronRule = new aws.cloudwatch.EventRule('daily-schedule', {
  scheduleExpression: 'cron(0 16 * * ? *)',
})

new aws.lambda.Permission('allow-event-bridge-invoke', {
  action: 'lambda:InvokeFunction',
  function: lambdaFunction.name,
  principal: 'events.amazonaws.com',
  sourceArn: cronRule.arn,
})

new aws.cloudwatch.EventTarget('event-target', {
  rule: cronRule.name,
  arn: lambdaFunction.arn,
})

new aws.cloudwatch.LogGroup('reset-budgets-log-group', {
  name: `/aws/lambda/lambda-reset-budgets`,
  retentionInDays: 14,
})

new aws.iam.RolePolicy('lambda-logging-policy', {
  role: iamForLambda.name,
  policy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        Resource: 'arn:aws:logs:*:*:*',
      },
    ],
  },
})

export const lambdaName = lambdaFunction.name
export const schedule = cronRule.scheduleExpression
