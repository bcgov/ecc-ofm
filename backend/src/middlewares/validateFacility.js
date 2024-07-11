const log = require('../components/logger')
const { isIdirUser } = require('../components/utils')

/**
 * Validates that the user is authorized to work with the specified Facility.
 * @param
 * @returns
 */
module.exports = function (portalAccess = true) {
  return async function (req, res, next) {
    log.verbose(`validating facility`)
    if (isIdirUser(req)) return next()

    const facilityId = req.params.facilityId ?? req.query.facilityId ?? req.body.facilityId
    if (!facilityId) return next()

    let valid
    if (portalAccess) {
      valid = req.session?.passport?.user?.facilities?.some((facility) => facility.facilityId === facilityId && facility.ofmPortalAccess)
    } else {
      valid = req.session?.passport?.user?.facilities?.some((facility) => facility.facilityId === facilityId)
    }
    valid ? next() : res.sendStatus(403)
  }
}
