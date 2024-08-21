const USERNAME = Cypress.env('PORTAL_USERNAME')
const PASSWORD = Cypress.env('PORTAL_PASSWORD')
const PORTAL_URL = Cypress.env('PORTAL_URL')

describe('Reporting', () => {
  beforeEach(() => {
    cy.loginToPortal(USERNAME, PASSWORD, PORTAL_URL)
    cy.visit(PORTAL_URL)
    cy.get('#reporting-card').click()
  })

  it('pending reports', () => {
    cy.get('button[class*="v-tab"]').contains('Pending Reports').click()
    cy.get('h2').contains('Report Details')

    // Check for at least one pending report
    cy.get('#pending-reports-table')
      .find('tbody')
      .find('tr')
      .should('have.length.at.least', 1)
  })

  it('reporting history', () => {
    cy.get('button[class*="v-tab"]').contains('Reporting History').click()
    cy.get('label').contains('Status(es)')

    // Check for at least one historical report
    cy.get('#reporting-history-table')
      .find('tbody')
      .find('tr')
      .should('have.length.at.least', 1)
  })
})
