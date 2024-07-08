const log = require('../components/logger')

/**
 * Validates that the user is authorized to work with the specified Organization.
 * @param
 * @returns
 */
module.exports = function () {
  return async function (req, res, next) {
    log.info(`validating organization`)
    const organizationId = req.params.organizationId ?? req.body.organizationId
    if (!organizationId) return next()
    const valid = organizationId === req.session?.passport?.user?.organizationId

    valid ? next() : res.sendStatus(403)
  }
}
