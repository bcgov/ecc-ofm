const log = require('../components/logger')

/**
 * Validates that the user is authorized to work with the specified Facility.
 * @param
 * @returns
 */
module.exports = function (portalAccess = true) {
  return async function (req, res, next) {
    log.info(`validating facility`)
    const facilityId = req.params.facilityId ?? req.query.facilityId ?? req.body.facilityId
    console.log(req.params)
    console.log('facilityId', facilityId)
    if (!facilityId) return next()

    console.log('facilities', req.session?.passport?.user?.facilities)
    let valid
    if (portalAccess) {
      valid = req.session?.passport?.user?.facilities?.some((facility) => facility.facilityId === facilityId && facility.ofmPortalAccess)
    } else {
      valid = req.session?.passport?.user?.facilities?.some((facility) => facility.facilityId === facilityId)
    }
    console.log('valid', valid)
    valid ? next() : res.sendStatus(403)
  }
}
