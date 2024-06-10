const { getRawFundingAgreementById } = require('../components/fundingAgreements')
const log = require('../components/logger')

/**
 * Validates that the user is an Expense Authority for the FA's facility.
 * @param
 * @returns
 */
module.exports = function () {
  return async function (req, res, next) {
    log.verbose(`validating expense authority`)

    const contactId = req?.body.contactId
    // Only validate a signing update (which will include contactId)
    if (!contactId) return next()

    const user = req.session?.passport?.user
    // Validate that the contactId represents the currentUser as you can only sign for yourself
    if (contactId !== user?.contactId) {
      return res.sendStatus(403)
    }

    // Send raw queries since we don't want to mess with the request/response
    const fundingAgreement = await getRawFundingAgreementById(req?.params?.fundingAgreementId)

    // Check that the current user is an expense authority for the facility
    const valid = user?.facilities?.some((f) => f.facilityId === fundingAgreement?.facilityId && f.isExpenseAuthority)

    valid ? next() : res.sendStatus(403)
  }
}
