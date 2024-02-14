'use strict'
const { createScanner } = require('clamdjs')
const config = require('../config')
const HttpStatus = require('http-status-codes')
const log = require('./logger')

async function scanFilePayload(req, res, next) {
  console.log(req.body)
  console.log(req.files)

  let scanResults = await Promise.all(
    req.files.map((file) => {
      log.info(`scanning file ${file.originalname}`)
      return scanFile(file.buffer)
    }),
  )

  const isAllFilesClean = scanResults.every((result) => result === true)

  if (!isAllFilesClean) {
    return res.status(HttpStatus.NOT_ACCEPTABLE).json({
      status: HttpStatus.NOT_ACCEPTABLE,
      message: 'File has failed the virus scan',
    })
  }

  // no virus found in file
  next()
}

async function scanFile(buffer) {
  try {
    const ClamAVScanner = createScanner(config.get('clamav:host'), Number(config.get('clamav:port')))
    const clamAVScanResult = await ClamAVScanner.scanBuffer(buffer, 3000, 1024 * 1024)
    if (clamAVScanResult.includes('FOUND')) {
      log.error('ClamAV scan found possible virus')
      return false
    }
  } catch (e) {
    // if virus scan is not to be performed/cannot be performed
    log.error('ClamAV Scanner was not found: ' + e)
    //TODO what happens if Clam AV isn't available.
  }
  log.info('ClamAV scan found no virus in file, allowing upload...')
  return true
}

const utils = {
  scanFilePayload
}

module.exports = utils
