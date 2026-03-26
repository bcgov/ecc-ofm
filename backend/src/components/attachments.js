'use strict'
const { getOperation, handleError } = require('./utils')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const { AttachmentMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')

async function getAttachments(req, res) {
  try {
    const emailId = req.query.notificationId
    const operation =
      'attachments?' +
      '$select=attachmentid,filename&' +
      '$expand=attachment_activity_mime_attachments(' +
      `$select=activitymimeattachmentid;$filter=(_objectid_value eq ${emailId}))&$filter=(attachment_activity_mime_attachments/any(o1:(o1/_objectid_value eq ${emailId}))` +
      ')'
    const response = await getOperation(operation)
    const documents = response?.value?.map((document) => {
      const mimeData = document.attachment_activity_mime_attachments[0]
      const documentMap = new MappableObjectForFront(document, AttachmentMappings)
      documentMap.data.documentId = mimeData.activitymimeattachmentid
      documentMap.data.type = 'attachment'
      return documentMap.toJSON()
    })

    return res.status(HttpStatus.OK).json(documents)
  } catch (e) {
    handleError(res, e)
  }
}

async function getAttachmentFile(req, res) {
  try {
    const attachmentId = req.params.attachmentId
    const operation = `activitymimeattachments(${attachmentId})/body`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(response?.value)
  } catch (e) {
    handleError(res, e)
  }
}

module.exports = {
  getAttachments,
  getAttachmentFile,
}
