'use strict'
const { postDocuments } = require('./utils')
const FormData = require('form-data')
const HttpStatus = require('http-status-codes')
const log = require('./logger')
const { isHeicFile, convertHeicBufferToJpg, updateHeicFileNameToJpg, getPostDocumentsHeaders } = require('../util/uploadFileUtils')

async function createDocuments(req, res) {
  try {
    const { body, files } = req
    const formFile = new FormData()
    await Promise.all(
      files?.map(async (file) => {
        let { buffer, fieldname: fieldname, originalname: filename } = file
        if (isHeicFile(filename)) {
          log.verbose('convertHeicFileToJpg :: converting from heic', file)
          buffer = await convertHeicBufferToJpg(buffer)
          filename = updateHeicFileNameToJpg(filename)
        }
        formFile.append(fieldname, buffer, { filename })
      }),
    )
    formFile.append('fileMapping', body['fileMapping'])
    const response = await postDocuments(formFile, getPostDocumentsHeaders(formFile))
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  createDocuments,
}
