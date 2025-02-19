'use strict'
const { getOperation, handleError } = require('./utils')
const HttpStatus = require('http-status-codes')

async function getFile(req, res) {
  try {
    let fileDataOperation = `msdyn_richtextfiles(${req.params.fileId})/`

    if (req.query.image === 'true') {
      fileDataOperation += 'msdyn_imageblob/$value?size=full'
    } else {
      fileDataOperation += 'msdyn_fileblob'
    }
    const fileDataResponse = await getOperation(fileDataOperation)

    const fileDetailsOperation = `fileattachments?$filter=(_objectid_value eq ${req.params.fileId})`
    const fileDetailsResponse = await getOperation(fileDetailsOperation)
    const fileDetails = fileDetailsResponse?.value[0] || { mimetype: undefined, filename: undefined }

    return res.status(HttpStatus.OK).json({
      fileData: fileDataResponse?.value,
      mimetype: fileDetails.mimetype,
      filename: fileDetails.filename,
    })
  } catch (e) {
    handleError(res, e)
  }
}

module.exports = {
  getFile,
}
