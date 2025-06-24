import * as aws from '@pulumi/aws'

export const lambdaBucket = new aws.s3.Bucket('lambda-code-bucket')
