const log = require('../log')

const _ = require('lodash')
const async = require('async')
const TelegramBot = require('node-telegram-bot-api')

// see https://github.com/yagop/node-telegram-bot-api/blob/master/doc/usage.md#sending-files
process.env.NTBA_FIX_350 = 1

const settings = {
  accessToken: process.env.TELEGRAM_ACCESS_TOKEN
}

let client

exports.start = (cb) => {
  cb = cb || function () {}

  if (!settings.accessToken) {
    log.warn('[telegram] disabled because TELEGRAM_ACCESS_TOKEN is missing')
    return cb()
  }

  client = new TelegramBot(settings.accessToken)

  cb()
}

exports.sendMessage = (recipients, text, cb) => {
  cb = cb || function () {}

  if (!client) {
    return cb()
  }

  const params = {
    parse_mode: 'Markdown'
  }

  async.each(recipients, (recipient, cb) => {
    client.sendMessage(recipient, text, params).then(() => {
      cb()
    }).catch((err) => {
      cb(err)
    })
  }, cb)
}

exports.sendAnimation = (recipients, shortFile, shortKey, caption, cb) => {
  cb = cb || function () {}

  if (!client) {
    return cb()
  }

  const params = {
    caption,
    parse_mode: 'Markdown'
  }

  async.each(recipients, (recipient, cb) => {
    client.sendAnimation(recipient, shortFile, params, { filename: shortKey, contentType: 'image/gif' }).then(() => {
      cb()
    }).catch((err) => {
      cb(err)
    })
  }, cb)
}

exports.sendVideo = (recipients, videoUrl, caption, cb) => {
  cb = cb || function () {}

  if (!client) {
    return cb()
  }

  const params = {
    caption,
    supports_streaming: true,
    parse_mode: 'Markdown'
  }

  async.each(recipients, (recipient, cb) => {
    client.sendVideo(recipient, videoUrl, params).then(() => {
      cb()
    }).catch((err) => {
      cb(err)
    })
  }, cb)
}
