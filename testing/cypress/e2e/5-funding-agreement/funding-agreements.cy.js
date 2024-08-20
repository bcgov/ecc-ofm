const USERNAME = Cypress.env('PORTAL_USERNAME')
const PASSWORD = Cypress.env('PORTAL_PASSWORD')
const PORTAL_URL = Cypress.env('PORTAL_URL')

describe('Funding', () => {
  beforeEach(() => {
    cy.loginToPortal(USERNAME, PASSWORD, PORTAL_URL)
    cy.visit(PORTAL_URL)
    cy.get('#funding-card').click()
    cy.get('button[class*="v-tab"]').contains('Funding Agreements').click()
  })

  it('funding-agreements', () => {
    cy.get('h2').contains('Funding Details')

    // Check for at least one funding detail
    cy.get('#funding-agreements-table')
      .find('tbody')
      .find('tr')
      .should('have.length.at.least', 1)
  })
})
