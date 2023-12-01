'use strict'
const { postDocuments } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { DocumentFileMappings } = require('../util/mapping/Mappings')
const formidable = require('formidable')
const FormData = require('form-data')
const HttpStatus = require('http-status-codes')
const log = require('./logger')
const { getFileExtension, convertHeicDocumentToJpg } = require('../util/uploadFileUtils')

function processUploadedDocuments(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true })
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error)
        return
      }
      resolve({ ...fields, ...files })
    })
  })
}

async function createDocuments(req, res) {
  try {
    log.info('================createDocuments================ ')
    const body = await processUploadedDocuments(req)
    let payload = new FormData()
    payload.append('fileMapping', body['fileMapping'])
    log.info('fileMapping = ', body['fileMapping'])
    for (let key in body) {
      if (key != 'fileMapping') {
        payload.append(key, body[key].path)
        log.info(key, body[key].path)
      }
    }
    log.info('==============DONE=================')

    let response = await postDocuments(payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  createDocuments,
}
