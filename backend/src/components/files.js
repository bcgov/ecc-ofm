'use strict'
const { getOperation, handleError } = require('./utils')
const HttpStatus = require('http-status-codes')

async function getFile(req, res) {
  try {
    let operation = `msdyn_richtextfiles(${req.params.fileId})/`
    if (req.query.image) {
      operation += 'msdyn_imageblob/$value?size=full'
    } else {
      operation += 'msdyn_fileblob'
    }
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(response?.value)
  } catch (e) {
    handleError(res, e)
  }
}

module.exports = {
  getFile,
}
