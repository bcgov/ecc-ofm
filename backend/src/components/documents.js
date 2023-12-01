'use strict'
const { postDocuments } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { DocumentFileMappings } = require('../util/mapping/Mappings')
const formidable = require('formidable')
const fs = require('fs')
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
    const { headers, body, files } = req
    const { buffer, originalname: filename } = files[0]

    log.info('headers :', headers)
    log.info('files', files)
    log.info('fileMapping', body['fileMapping'])

    const formFile = new FormData()
    formFile.append('file0', buffer, { filename })
    formFile.append('fileMapping', body['fileMapping'])

    headers['Content-Type'] = 'multipart/form-data'

    let response = await postDocuments(formFile, formFile.getHeaders())
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  createDocuments,
}
