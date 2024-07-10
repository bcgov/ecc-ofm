const log = require('../components/logger')

/**
 * Validates that the request contact is the current user
 * @param
 * @returns
 */
module.exports = function () {
  return async function (req, res, next) {
    log.verbose(`validating contact`)

    const contactId = req?.params.contactId
    if (!contactId) return next()

    const valid = contactId === req.session?.passport?.user.contactId

    valid ? next() : res.sendStatus(403)
  }
}
