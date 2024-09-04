const USERNAME = Cypress.env('PORTAL_USERNAME')
const PASSWORD = Cypress.env('PORTAL_PASSWORD')
const PORTAL_URL = Cypress.env('PORTAL_URL')

describe('Payments', () => {
  beforeEach(() => {
    cy.loginToPortal(USERNAME, PASSWORD, PORTAL_URL)
    cy.visit(PORTAL_URL)
    cy.get('#funding-card').click()
    cy.get('button[class*="v-tab"]').contains('Payment Records').click()
  })

  it('payment history', () => {
    cy.get('h2').contains('Payment History')

    // Check for at least one payment history
    // TODO (weskubo-cgi) Update when payments available
    cy.get('#payment-history-table')
      .find('tbody')
      .find('tr')
      .should('have.length.at.least', 0)
  })

  it('scheduled payments', () => {
    cy.get('h2').contains('Payment History')

    // Check for at least one payment history
    // TODO (weskubo-cgi) Enable when payments available
    cy.get('#scheduled-payments-table')
      .find('tbody')
      .find('tr')
      .should('have.length.at.least', 0)
  })
})
