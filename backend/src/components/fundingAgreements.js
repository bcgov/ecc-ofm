'use strict'
const { getOperation } = require('./utils')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const { buildFilterQuery } = require('../util/common')
const { FundingAgreementMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const log = require('./logger')

async function getFundingAgreements(req, res) {
  try {
    const operation = `ofm_fundings?$select=ofm_fundingid,ofm_funding_number,ofm_start_date,ofm_end_date,_ofm_application_value,statuscode,statecode&$filter=(${buildFilterQuery(
      req?.query,
      FundingAgreementMappings,
    )})`

    const response = await getOperation(operation)
    //CRM confirmed that there will only ever be one Funding Agreement per ApplicationID. However response returns an array. If index 0 contains data, return it
    if (response?.value[0]) {
      return res.status(HttpStatus.OK).json(new MappableObjectForFront(response?.value[0], FundingAgreementMappings).toJSON())
    }

    return res.status(HttpStatus.NO_CONTENT).json()
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getFundingAgreements,
}
