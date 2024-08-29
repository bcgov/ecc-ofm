const USERNAME = Cypress.env('PORTAL_USERNAME')
const PASSWORD = Cypress.env('PORTAL_PASSWORD')
const PORTAL_URL = Cypress.env('PORTAL_URL')

describe('Manage Organizations/Facilities', () => {
  beforeEach(() => {
    cy.loginToPortal(USERNAME, PASSWORD, PORTAL_URL)
    cy.visit(PORTAL_URL)
    cy.get('#account-mgmt-card').click()
    cy.get('#org-facilities-card').click()
  })

  it('check organization table', () => {
    cy.get('h4').contains('Organization Details')
  })
})
