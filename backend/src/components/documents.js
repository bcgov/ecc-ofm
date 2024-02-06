'use strict'
const { postDocuments, getOperation, deleteOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { DocumentMappings } = require('../util/mapping/Mappings')
const FormData = require('form-data')
const HttpStatus = require('http-status-codes')
const log = require('./logger')
const { isEmpty } = require('lodash')
const { isHeicFile, convertHeicBufferToJpg, updateHeicFileNameToJpg, getPostDocumentsHeaders } = require('../util/uploadFileUtils')

function buildGetDocumentsFilterQuery(query) {
  if (isEmpty(query)) return
  let filterQuery = ''
  const mappedQuery = new MappableObjectForBack(query, DocumentMappings).toJSON()
  Object.entries(mappedQuery)?.forEach(([key, value]) => {
    filterQuery = isEmpty(filterQuery) ? filterQuery.concat(`${key} eq ${value}`) : filterQuery.concat(` and ${key} eq ${value}`)
  })
  return filterQuery
}

async function getDocuments(req, res) {
  try {
    const documents = []
    const operation = `ofm_documents?$select=ofm_documentid,ofm_name,ofm_file_name,ofm_subject,ofm_description,modifiedon,statuscode,statecode&$filter=(
      ${buildGetDocumentsFilterQuery(req?.query)} )`
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
