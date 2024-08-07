const USERNAME = Cypress.env('portal_username')
const PASSWORD = Cypress.env('portal_password')
const PORTAL_URL = Cypress.env('portal_url')

describe('Login to Portal', () => {
  it('successful login', () => {
    cy.loginToPortal(USERNAME, PASSWORD, PORTAL_URL)
    cy.visit(PORTAL_URL)
    cy.get('#reporting-card').should('exist')
    cy.get('#funding-card').should('exist')
    cy.get('#assistance-card').should('exist')
    cy.get('#applications-card').should('exist')
    cy.get('#account-mgmt-card').should('exist')
    cy.get('#help-card').should('not.exist')
  })

  it('failed login', () => {
    cy.loginToPortalNoSession('doesnotexist', 'password', PORTAL_URL)
    cy.visit(PORTAL_URL)
    // Should be back on Login screen
    cy.get('a[id=bceid-login').should('exist')
    cy.get('#reporting-card').should('not.exist')
  })
})
