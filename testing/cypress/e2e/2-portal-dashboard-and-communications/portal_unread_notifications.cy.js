const dayjs = require('dayjs')
const ADD_USERNAME = Cypress.env('aad_username')
const ADD_PASSWORD = Cypress.env('aad_password')
const CRM_URL = Cypress.env('crm_url')
const CRM_BASE_URL = Cypress.env('crm_base_url')

const PORTAL_USERNAME = Cypress.env('portal_username')
const PORTAL_PASSWORD = Cypress.env('portal_password')
const PORTAL_URL = Cypress.env('portal_url')

const MESSAGE_TIME = new dayjs().format('YYYY-MMM-DD HH:mm:ss')
const MESSAGE_DATE = new dayjs().format('YYYY-MMM-DD')

// log into crm and create notifiction
// before(() => {
//   cy.visit(PORTAL_URL)
//   cy.loginToAADNoSession(ADD_USERNAME, ADD_PASSWORD, CRM_URL, CRM_BASE_URL)

//   cy.visit(CRM_URL)
//   cy.origin(CRM_BASE_URL, { args: { MESSAGE_TIME } }, ({ MESSAGE_TIME }) => {
//     cy.on('uncaught:exception', (e) => {
//       if (e.message.includes(' ')) {
//         return false
//       }
//     })

//     // click on notifications
//     cy.get('ul[aria-label="Communication"]')
//       .find('li[aria-label="Notifications"]')
//       .click()

//     // click on email button
//     cy.get('button[aria-label="Email"]', { timeout: 20000 })
//       .should('be.visible')
//       .click()

//     // input the contact field
//     cy.get(
//       'span[title="To - Enter the account, contact, lead, queue, or user recipients for the email."]'
//     )
//       .parents('div[role="presentation"]')
//       .eq(2)
//       .find('input[aria-label="To, Multiple Selection Lookup"]', {
//         timeout: 20000,
//       })
//       .click()
//       .clear()
//       .type('ofmqa05')
//       .next('button')
//       .click()
//     cy.get('#tab-section2').scrollTo('top')
//     cy.contains('qa05', { timeout: 20000 }).should('be.visible').click()

//     // enter the subject
//     cy.get('input[aria-label="Subject"]')
//       .click()
//       .clear()
//       .type(`Automation Test - ${MESSAGE_TIME}`)

//     // select communication type
//     cy.get('span[title="Communication Type"]')
//       .parents('div[role="presentation"]')
//       .eq(2)
//       .find(
//         'button[aria-label="Search records for Communication Type, Lookup field"]',
//         {
//           timeout: 20000,
//         }
//       )
//       .click()
//     cy.contains('Action Required').click()

//     // click save
//     cy.get('button[aria-label="Save (CTRL+S)"]').click()

//     // change activity status
//     cy.get('button[title="More Header Editable Fields"]').click()
//     cy.get('select[title="Open"]').select('Completed')

//     // click save
//     cy.get('button[aria-label="Save (CTRL+S)"]').click()
//   })
// })

describe.skip('OFM Portal', () => {
  beforeEach(() => {
    // log into portal
    cy.loginToPortal(PORTAL_USERNAME, PORTAL_PASSWORD, PORTAL_URL)
  })

  it('Checks if latest message on portal is Unread', () => {
    cy.visit(PORTAL_URL)

    // click on mail icon in top right
    cy.get('#mail_box_button').click()

    // check latest notification's read/unread
    cy.get('table')
      .find('tr')
      .eq(2)
      .find('td')
      .eq(1)
      .should('have.text', 'Unread')
  })

  it('Checks if latest message subject on portal is Automation Test - Subject [Correct date time]', () => {
    cy.visit(PORTAL_URL)

    // click on mail icon in top right
    cy.get('#mail_box_button').click()

    // check latest notification's subject
    cy.get('table')
      .find('tr')
      .eq(2)
      .find('td')
      .eq(2)
      .should('have.text', `Automation Test - ${MESSAGE_TIME}`)
  })

  it('Checks if latest message date on portal is the Correct Date', () => {
    cy.visit(PORTAL_URL)

    // click on mail icon in top right
    cy.get('#mail_box_button').click()

    // check latest notification's date
    cy.get('table')
      .find('tr')
      .eq(2)
      .find('td')
      .eq(3)
      .should('have.text', `${MESSAGE_DATE}`)
  })
})
