'use strict'
const { getOperation } = require('./utils')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const { buildFilterQuery, buildDateFilterQuery } = require('../util/common')
const { PaymentMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const log = require('./logger')

async function getPayments(req, res) {
  try {
    const payments = []
    let operation = 'ofm_payments?$select=ofm_paymentid,ofm_name,_ofm_facility_value,_ofm_funding_value,ofm_payment_type,ofm_amount,ofm_invoice_received_date,statuscode,statecode'
    const filter = `${buildDateFilterQuery(req?.query, 'ofm_invoice_received_date')}${buildFilterQuery(req?.query, PaymentMappings)}`
    operation += `&$filter=(${filter})&pageSize=500`
    const response = await getOperation(operation)
    response?.value?.forEach((item) => payments.push(new MappableObjectForFront(item, PaymentMappings).toJSON()))
    return res.status(HttpStatus.OK).json(payments)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getPayments,
}
