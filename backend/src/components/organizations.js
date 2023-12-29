'use strict'
const { getOperation } = require('./utils')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const { OrganizationMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')

async function getOrganization(req, res) {
  try {
    const operation = `accounts(${req.params.accountId})?$select=accountid,accountnumber,name,emailaddress1,ofm_business_type,telephone1,telephone2,address1_line1,address1_line2,address1_city,address1_postalcode,address1_stateorprovince,ofm_is_mailing_address_different,address2_line1,address2_line2,address2_city,address2_postalcode,address2_stateorprovince,statecode,statuscode`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, OrganizationMappings).toJSON())
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getOrganization,
}
