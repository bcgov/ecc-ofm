'use strict'
const { postDocuments, getOperation, deleteOperationWithObjectId } = require('./utils')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const { DocumentMappings } = require('../util/mapping/Mappings')
const FormData = require('form-data')
const HttpStatus = require('http-status-codes')
const log = require('./logger')
const { buildFilterQuery } = require('../util/common')
const { isHeicFile, convertHeicBufferToJpg, updateHeicFileNameToJpg, getPostDocumentsHeaders } = require('../util/uploadFileUtils')

async function getDocuments(req, res) {
  try {
    const documents = []
    const operation = `ofm_documents?$select=ofm_documentid,ofm_name,ofm_file_name,ofm_subject,ofm_description,modifiedon,statuscode,statecode&$filter=(${buildFilterQuery(
      req?.query,
      DocumentMappings,
    )} )`
    const response = await getOperation(operation)
    response?.value?.forEach((document) => documents.push(new MappableObjectForFront(document, DocumentMappings).toJSON()))
    return res.status(HttpStatus.OK).json(documents)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

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
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function deleteDocument(req, res) {
  try {
    await deleteOperationWithObjectId('ofm_documents', req.params.documentId)
    return res.status(HttpStatus.OK).json()
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getDocuments,
  createDocuments,
  deleteDocument,
}
