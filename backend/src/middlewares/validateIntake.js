const HttpStatus = require('http-status-codes')
const log = require('../components/logger')
const { getOperation } = require('../components/utils')
const { getFacilitiesWithValidIntake } = require('../components/facilities')
const { APPLICATION_RENEWAL_TYPES, APPLICATION_STATUS_CODES } = require('../util/constants')

/**
 * Validates that the facility has a valid intake window when a renewal is submitted.
 * @param
 * @returns
 */
module.exports = function () {
  return async function (req, res, next) {
    log.verbose('validating intake')
    try {
      if (req.body?.statusCode !== APPLICATION_STATUS_CODES.SUBMITTED) return next()

      if (req.body?.applicationRenewalType !== APPLICATION_RENEWAL_TYPES.RENEWAL) return next()

      let facilityId = req.body?.facilityId
      if (!facilityId) {
        const appResponse = await getOperation(`ofm_applications(${req.params.applicationId})?$select=_ofm_facility_value`)
        facilityId = appResponse?._ofm_facility_value
      }

      if (!facilityId) return next()

      const validIntakeFacilityIds = await getFacilitiesWithValidIntake([facilityId])

      if (validIntakeFacilityIds.has(facilityId)) return next()

      log.verbose(`Renewal submission blocked: facility ${facilityId} has no valid intake`)
      return res.sendStatus(HttpStatus.FORBIDDEN)
    } catch (e) {
      log.error('Error validating intake', e)
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
