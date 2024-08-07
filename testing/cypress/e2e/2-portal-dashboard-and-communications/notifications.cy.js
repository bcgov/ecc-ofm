import { v4 as uuidv4 } from 'uuid'

const USERNAME = Cypress.env('portal_username')
const PASSWORD = Cypress.env('portal_password')
const PORTAL_URL = Cypress.env('portal_url')

describe('Portal Assistance Request', () => {
  beforeEach(() => {
    cy.loginToPortal(USERNAME, PASSWORD, PORTAL_URL)
    cy.visit(PORTAL_URL)
    cy.get('button[id="mail_box_button"]').click()
    cy.get('button').contains('Notifications').click()
  })

  it('view notifications ', () => {
    // TODO (weskubo-cgi) Add identifier to notifications-table
    //cy.get('#notifications-table > table > tbody')
    cy.get('table').first().find('tr').should('have.length.at.least', 2)

    //cy.get('table').first().find('tr').should('have.length.at.least', 2)
    cy.get('table').first().find('tr').eq(2).click({ force: true })

    //         // confirm that the portal's assistance request has the right information submitted in the form for the assistance request
    //         cy.contains('Reply').parent().should('have.class', 'reply-disabled')

    // Validate From: text
    cy.get('div[class*="notification-from-text"]').should(
      'have.text',
      `From:  Operating Funding Model Program`
    )

    // Validate Mark Unread button exists
    cy.get('span').contains('Mark Unread').should('exist')

    // Validate content
    cy.get('div[class*="notification-content"]').should('not.be.empty')
  })

  it.skip('mark message unread', () => {
    // TODO (weskubo-cgi) Complete this test
  })

  it.skip('mark message read', () => {
    // TODO (weskubo-cgi) Complete this test
  })
})
