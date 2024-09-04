const USERNAME = Cypress.env('PORTAL_USERNAME')
const PASSWORD = Cypress.env('PORTAL_PASSWORD')
const PORTAL_URL = Cypress.env('PORTAL_URL')

describe('Login to Portal', () => {
  it('system messages', () => {
    cy.visit(PORTAL_URL)
    cy.get('div[role="alert"]').contains('Test Message')
  })
  it('successful login', () => {
    cy.loginToPortal(USERNAME, PASSWORD, PORTAL_URL)
    cy.visit(PORTAL_URL)

    // Facility is hidden in Org header
    cy.get('#changeFacility').should('not.exist')

    // All cards are available to Account Manager
    cy.get('#reporting-card').should('exist')
    cy.get('#funding-card').should('exist')
    cy.get('#assistance-card').should('exist')
    cy.get('#applications-card').should('exist')
    cy.get('#account-mgmt-card').should('exist')
    cy.get('#help-card').should('exist')
  })

  it('failed login', () => {
    // SSO has error in application code on failed login
    cy.on('uncaught:exception', (e) => {
      return false
    })
    cy.loginToPortalNoSession('doesnotexist', 'password', PORTAL_URL)
    cy.visit(PORTAL_URL)
    // Should be back on Login screen
    cy.get('a[id=bceid-login').should('exist')
    cy.get('#reporting-card').should('not.exist')
  })
})
