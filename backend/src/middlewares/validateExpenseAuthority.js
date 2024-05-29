const { getRawFacilityContacts } = require('../components/facilities')
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
    if (!contactId) next()

    // Validate that the contactId represents the currentUser as you can only sign for yourself
    if (contactId !== req.session?.passport?.user?.contactId ) {
      res.sendStatus(403)
      return
    }

    // Send raw queries since we don't want to mess with the request/response
    const fundingAgreement = await getRawFundingAgreementById(req?.params?.fundingAgreementId)

    // TODO (weskubo-cgi) Use the information on the passport.user instead once available from CRM
    const contacts = await getRawFacilityContacts(fundingAgreement?.facilityId)

    // Check that the current user is an expense authority for the facility    
    const valid = contacts.some((contact) => contact.contactId === contactId && contact.isExpenseAuthority)

    valid ? next() : res.sendStatus(403)
  }
}
