const log = require('../log')

const AWS = require('aws-sdk')

const settings = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
  bucket: process.env.AWS_S3_BUCKET,
  endpoint: process.env.S3_ENDPOINT,
}

let client

exports.start = (cb) => {
  cb = cb || function () {}

  if (!settings.accessKeyId || !settings.secretAccessKey || !settings.region || !settings.bucket) {
    log.warn(`[aws/s3] client disabled because AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION and/or AWS_S3_BUCKET is missing`)
    return cb()
  }

  // JCH - If endpoint does not exist (in environmet variable) is AWS else is a Compatible S3 Bucket
  if (!settings.endpoint){
    //This is for AWS S3 bucket
    client = new AWS.S3({
      credentials: {
        accessKeyId: settings.accessKeyId,
        secretAccessKey: settings.secretAccessKey
      },
      region: settings.region
    })
  }
  else {
    //This is for compatible S3 bucket
    log.info(`[custom/s3] client will use a S3 compatible cloud provider...`)
    client = new AWS.S3({
      accessKeyId: settings.accessKeyId,
      secretAccessKey: settings.secretAccessKey,
      endpoint: new AWS.Endpoint(process.env.S3_ENDPOINT),
      s3ForcePathStyle: true // Use path-style addressing
    });
  }
  cb()
}

exports.putObject = (Key, Body, cb) => {
  cb = cb || function () {}

  if (!client) {
    return cb()
  }

  client.putObject({
    Bucket: settings.bucket,
    Key,
    Body
  }, cb)
}

exports.getSignedUrl = (Key, Expires, cb) => {
  cb = cb || function () {}

  if (!client) {
    return cb()
  }

  client.getSignedUrl('getObject', {
    Bucket: settings.bucket,
    Key,
    Expires
  }, cb)
}
