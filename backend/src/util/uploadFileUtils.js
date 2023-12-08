'use strict'
const convert = require('heic-convert')
const config = require('../config/index')

function getFileExtension(fileName) {
  if (fileName) return fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase()
  return ''
}

function isHeicFile(fileName) {
  const fileExtension = getFileExtension(fileName)
  return fileExtension === 'heic'
}

function updateHeicFileNameToJpg(filename) {
  const regex = /\.heic(?![\s\S]*\.heic)/i //looks for last occurrence of .heic case-insensitive
  return filename?.replace(regex, '.jpg')
}

async function convertHeicBufferToJpg(heicFileBuffer) {
  const jpgBuffer = await convert({
    buffer: heicFileBuffer,
    format: 'JPEG',
    quality: 0.5,
  })
  return jpgBuffer
}

function getPostDocumentsHeaders(formFile) {
  let headers = formFile.getHeaders()
  const headerKey = config.get('dynamicsApi:apiKeyHeader')
  headers[headerKey] = config.get('dynamicsApi:apiKeyValue')
  return headers
}

module.exports = {
  convertHeicBufferToJpg,
  getFileExtension,
  isHeicFile,
  getPostDocumentsHeaders,
  updateHeicFileNameToJpg,
}
