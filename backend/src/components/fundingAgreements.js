'use strict'
const { getOperation } = require('./utils')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const { buildFilterQuery } = require('../util/common')
const { FundingAgreementMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const log = require('./logger')

async function getFundingAgreements(req, res) {
  try {
    const fundingAgreements = []
    log.info('reqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
    log.info(req.query)
    const operation = `ofm_fundings?$select=ofm_fundingid,ofm_funding_number,ofm_start_date,ofm_end_date,_ofm_application_value,statuscode,statecode&$filter=(${buildFilterQuery(
      req?.query,
      FundingAgreementMappings,
    )})`

    //refactor this using StateCode so we only bring back one (the active) Funding Agreement
    const response = await getOperation(operation)
    log.info('the resp')
    log.info(response)

    log.info('empty:')

    if (response?.value[0]) {
      return res.status(HttpStatus.OK).json(new MappableObjectForFront(response?.value[0], FundingAgreementMappings).toJSON())
    }
    //Hoang confirmed that there will only ever be one Funding Agreement per ApplicationID.

    return res.status(HttpStatus.NO_CONTENT).json()
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getFundingAgreements,
}
