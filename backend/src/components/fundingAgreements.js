'use strict'
const { getOperation } = require('./utils')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const { buildFilterQuery } = require('../util/common')
const { FundingAgreementMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const log = require('./logger')
const { isEmpty } = require('lodash')

async function getFundingAgreements(req, res) {
  try {
    const fundingAgreements = []
    const operation = `ofm_fundings?$select=ofm_fundingid,ofm_funding_number,ofm_start_date,ofm_end_date,_ofm_application_value,_ofm_facility_value,statuscode,statecode&$filter=(${buildFilterQuery(
      req?.query,
      FundingAgreementMappings,
    )})`
    const response = await getOperation(operation)
    response?.value?.forEach((funding) => fundingAgreements.push(new MappableObjectForFront(funding, FundingAgreementMappings).toJSON()))
    if (isEmpty(fundingAgreements)) {
      return res.status(HttpStatus.NO_CONTENT).json()
    }
    return res.status(HttpStatus.OK).json(fundingAgreements)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getFundingAgreements,
}
