const log = require('../components/logger')
const { isIdirUser } = require('../components/utils')

/**
 * Validates that the request contact is the current user
 * @param
 * @returns
 */
module.exports = function () {
  return async function (req, res, next) {
    log.verbose(`validating contact`)

    if (isIdirUser(req)) return next()

    const contactId = req?.params.contactId ?? req?.query.contactId
    if (!contactId) return next()
    const valid = contactId === req.session?.passport?.user.contactId

    valid ? next() : res.sendStatus(403)
  }
}
