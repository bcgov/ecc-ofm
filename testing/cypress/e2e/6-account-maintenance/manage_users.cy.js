const USERNAME = Cypress.env('PORTAL_USERNAME')
const PASSWORD = Cypress.env('PORTAL_PASSWORD')
const PORTAL_URL = Cypress.env('PORTAL_URL')

describe('Manage Facility Users', () => {
  beforeEach(() => {
    cy.loginToPortal(USERNAME, PASSWORD, PORTAL_URL)
    cy.visit(PORTAL_URL)
    cy.get('#account-mgmt-card').click()
    cy.get('#manage-users-card').click()
  })

  it('check user table', () => {
    cy.get('h3').contains('Manage users')
  })
})
