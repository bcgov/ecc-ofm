'use strict'
const { getOperation, patchOperationWithObjectId, getOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { buildFilterQuery } = require('../util/common')
const { PaymentMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const log = require('./logger')
const { isEmpty } = require('lodash')

async function getPayments(req, res) {
  try {
    if (isEmpty(req?.query)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Query parameter is required' })
    }
    const applications = []
    const operation = `ofm_payments?$select=ofm_paymentid,ofm_name,_ofm_facility_value,_ofm_funding_value,ofm_payment_type,ofm_amount,statuscode,statecode&$filter=(${buildFilterQuery(
      req?.query,
      PaymentMappings,
    )})`
    const response = await getOperation(operation)
    response?.value?.forEach((application) => applications.push(mapApplicationObjectForFront(application)))
    return res.status(HttpStatus.OK).json(applications)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getPayments,
}
