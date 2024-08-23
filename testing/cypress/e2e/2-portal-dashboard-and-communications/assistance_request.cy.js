import { v4 as uuidv4 } from 'uuid'

const USERNAME = Cypress.env('PORTAL_USERNAME')
const PASSWORD = Cypress.env('PORTAL_PASSWORD')
const PORTAL_URL = Cypress.env('PORTAL_URL')

describe('Portal Assistance Request', () => {
  beforeEach(() => {
    cy.loginToPortal(USERNAME, PASSWORD, PORTAL_URL)
    cy.visit(PORTAL_URL)
    cy.get('button[id="mail_box_button"]').click()
    cy.get('button').contains('Messages').click()
  })

  it('Creates an Assistance Request with a Phone Number', () => {
    // ResizeObserver loop limit exceeded
    cy.on('uncaught:exception', (e) => {
      return false
    })

    // input fields
    const topic = 'Intake & Renewal'
    const subject = `Cypress ${uuidv4()}`
    const description = 'Description Line'

    // make the assistance request
    cy.get('button').contains('New message').click()
    cy.get('input[placeholder="[select a topic]"]').type(`${topic}{enter}`, {
      force: true,
    })
    cy.get('input[placeholder="Brief summary of request"]').type(subject)
    cy.get('textarea[placeholder^="Detailed description"]').type(description)
    cy.get('input[type="radio"]').first().check()
    cy.get('input[type="text"]').last().clear().type('403-403-4033')
    cy.get('button').contains('Submit').click()

    cy.get('p')
      .contains('Reference: REQ')
      .invoke('text')
      .then((text) => {
        const referenceNo = text.split(':')[1].trim()
        cy.get('button').contains('View messages').click()
        const newMessage = cy.get('div').contains(subject)
        newMessage.should('exist')
        const row = newMessage.parent().parent()
        row.click({ force: true })

        // confirm that the portal's assistance request has the right information submitted in the form for the assistance request
        cy.contains('Reply').parent().should('have.class', 'reply-disabled')

        cy.get('span[class="subject-header"]').should(
          'have.text',
          `Subject: ${subject}`
        )

        // TODO (weskubo-cgi) Add some ids to make more reliable selectors
        cy.get('div[data-v-f73bc3ca]')
          .contains('Status')
          .next()
          .should('have.text', 'Open')
        cy.get('div[data-v-f73bc3ca]')
          .contains('Reference#')
          .next()
          .should('have.text', referenceNo)
        cy.get('div[data-v-f73bc3ca]')
          .contains('Topic')
          .next()
          .should('have.text', topic)
        cy.contains(description).should('exist')
      })
  })

  it('Checks that topic, subject, and request description are mandatory', () => {
    // ResizeObserver loop limit exceeded
    cy.on('uncaught:exception', (e) => {
      return false
    })
    cy.get('button').contains('New message').click()

    // checks that topic is mandatory
    cy.get('input[placeholder="Brief summary of request"]').type('subject')
    cy.get('textarea[placeholder="Detailed description of request"]').type(
      'description'
    )
    cy.get('button').contains('Submit').click()
    cy.get('label')
      .contains('Topic')
      .parent()
      .next()
      .contains('This field is required')
      .should('exist')

    // checks that the subject is mandatory
    cy.get('input[placeholder="[select a topic]"]').type(`Reporting{enter}`, {
      force: true,
    })
    cy.get('input[placeholder="Brief summary of request"]').clear()
    cy.get('button').contains('Submit').click()
    cy.get('label')
      .contains('Subject')
      .parent()
      .next()
      .contains('This field is required')
      .should('exist')

    // checks that the description is mandatory
    cy.get('input[placeholder="Brief summary of request"]').type('subject')
    cy.get('textarea[placeholder="Detailed description of request"]').clear()
    cy.get('button').contains('Submit').click()
    cy.get('label')
      .contains('Request description')
      .parent()
      .next()
      .contains('This field is required')
      .should('exist')
  })

  it('Checks that the portal message radio is selected at the start', () => {
    cy.get('button').contains('New message').click()
    cy.get('label')
      .contains('Portal message')
      .prev()
      .find('input[type="radio"]')
      .should('be.checked')
  })

  it('Lets you cancel the message', () => {
    cy.get('button').contains('New message').click()
    cy.get('button').contains('Cancel').click()
  })

  it('Checks the different topics available', () => {
    // ResizeObserver loop limit exceeded
    cy.on('uncaught:exception', (e) => {
      return false
    })
    const topics = [
      'Intake & Renewal',
      'Reporting',
      'Account Maintenance',
      'Funding Agreement',
      'Payments and Funding',
      'Policy Question',
      'Technical Support',
      'Irregular Expense',
      'Other',
    ]

    cy.get('button').contains('New message').click()
    cy.get('div[class="v-field__input"]').first().as('topic')

    topics.forEach((topic) => {
      cy.get('@topic').click({ force: true })
      cy.get('.v-list-item__content').contains(topic).click()
      cy.contains(topic, { force: true }).should('exist')
    })
  })

  it('Checks 100 max character count in the subject', () => {
    const word105 =
      ' testing 105 characters - aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa '

    cy.get('button').contains('New message').click()
    cy.get('input[placeholder="Brief summary of request"]').type(word105)

    cy.get('input[placeholder="Brief summary of request"]')
      .invoke('val')
      .then((val) => {
        expect(val).to.have.length(100)
      })
  })

  it('Checks 1000 max character count in the description', () => {
    const word1005 =
      ' testing 1005 characters - aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa '

    cy.get('button').contains('New message').click()
    cy.get('textarea[placeholder="Detailed description of request"]').type(
      word1005
    )
    cy.get('textarea[placeholder="Detailed description of request"]')
      .invoke('val')
      .then((val) => {
        expect(val).to.have.length(1000)
      })
  })

  it('Allows you to select multiple facilities', () => {
    // ResizeObserver loop limit exceeded
    cy.on('uncaught:exception', (e) => {
      return false
    })
    cy.get('button').contains('New message').click()
    cy.get('input[id="selectFacility"]').click({ force: true })
    cy.get('.v-list-item').contains('Select All').click()
    cy.get('input[id="selectFacility"]')
      .parent()
      .get('div[class="v-select__selection"]')
      .should('have.length.at.least', 2)
  })
})
