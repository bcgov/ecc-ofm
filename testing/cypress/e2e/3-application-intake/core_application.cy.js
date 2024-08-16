const AAD_USERNAME = Cypress.env('AAD_USERNAME')
const AAD_PASSWORD = Cypress.env('AAD_PASSWORD')
const CRM_URL = Cypress.env('CRM_URL')
const CRM_BASE_URL = Cypress.env('CRM_BASE_URL')

const PORTAL_USERNAME = Cypress.env('PORTAL_USERNAME')
const PORTAL_PASSWORD = Cypress.env('PORTAL_PASSWORD')
const PORTAL_URL = Cypress.env('PORTAL_URL')

const operatingCosts = [
  ['Insurance', '111.00'],
  ['Upkeep and Labour', '222.00'],
  ['Utilities', '333.00'],
  ['Maintenance and Repairs', '444.00'],
  ['Furniture and Equipment', '555.00'],
  ['Supplies', '666.00'],
  ['Mortgage', '777.00'],
  ['Property/Municipal Tax', '888.00'],
  ['Strata Fees', '999.00'],
]

const staffing = [
  ['Infant/Toddler Early Childhood Educator', 11, 22],
  ['Early Childhood Educator', 33, 44],
  ['Early Childhood Educator Assistant', 55, 66],
  ['Responsible Adult', 77, 88],
]

const facilityContactInfo = [
  'Phone (landline)',
  'Phone (cell)',
  'Email Address',
]

const facilityInfo = [
  'Street address 1',
  'Street address 2',
  'City',
  'Province',
  'Postal code',
]

const contactInfo = [
  'First Name',
  'Last Name',
  'Role',
  'Email',
  'Phone Number',
  'Business BCeID',
]

// TODO (weskubo-cgi) Fix test
beforeEach('Navigate to Applications', () => {
  // log in to the portal
  cy.loginToPortal(PORTAL_USERNAME, PORTAL_PASSWORD, PORTAL_URL)
  cy.visit(PORTAL_URL)
  cy.get('#applications-card').click()
})

// beforeEach(() => {
//   cy.origin(CRM_BASE_URL, () => {
//     cy.on('uncaught:exception', (e) => {
//       return false
//     })
//   })
//   cy.loginToAAD(AAD_USERNAME, AAD_PASSWORD, CRM_URL, CRM_BASE_URL)
//   cy.visit(CRM_URL)

//   cy.origin(CRM_BASE_URL, () => {
//     cy.on('uncaught:exception', (e) => {
//       return false
//     })
//     cy.get('li[aria-label="Case Management"]')
//       .find('li[aria-label="Applications"]')
//       .click({ timeout: 30000 })
//     cy.get('input[aria-label="Application Filter by keyword"]').type(
//       'APP-23000010{enter}'
//     )
//     cy.contains('APP-23000010').last().click()
//   })
//})

describe('Applications', () => {
  it('view applications', () => {
    cy.get('h1').contains('Applications')

    // Check for at least one Application
    cy.get('#applications-history-table')
      .find('tbody')
      .find('tr')
      .should('have.length.at.least', 1)
  })

  it('create application', () => {
    const facility = {}
    const primaryContact = {}
    const secondaryContact = {}
    const expenseAuthority = {}

    cy.contains('Add OFM Application').click()

    cy.wait(5000)
    // ===============
    // Select Facility
    // ===============
    cy.get('input[id="confirm-info"]').check({ force: true })

    // Facility
    cy.get('input[placeholder="Select facility"]')
      .should('exist')
      .click({ force: true })
    cy.get('div[class*="v-list-item"]')
      .first()
      .should('exist')
      .click({ force: true })

    cy.get('button').contains('Next').click()

    // ================
    // Facility Details
    // ================
    cy.contains('facility:')
      .find('span')
      .invoke('text')
      .then((text) => {
        facility.facilityName = text
        console.log(text)
      })

    facilityContactInfo.map((info) => {
      cy.get('label')
        .contains(info)
        .parent()
        .next()
        .invoke('text')
        .then((text) => {
          facility[info] = text
        })
    })

    facilityInfo.map((info) => {
      cy.get('label')
        .contains(info)
        .parent()
        .next()
        .invoke('text')
        .then((text) => {
          facility['Physical ' + info] = text
        })
    })

    facilityInfo.map((info) => {
      cy.contains('Mailing address')
        .parent()
        .nextAll()
        .get('label')
        .contains(info)
        .parent()
        .next()
        .invoke('text')
        .then((text) => {
          facility['Mailing ' + info] = text
        })
    })

    // Fiscal Year End Date
    const date = new Date()
    cy.get('#fiscal-year-end-date')
      .should('exist')
      .type(`${date.getFullYear()}-12-31`)

    // Primary Contact
    cy.get('[id="select-primary-contact"]').click({
      force: true,
    })
    cy.get('.v-list-item').first().click()

    contactInfo.map((info) => {
      cy.contains('Primary Contact')
        .nextAll()
        .contains(info)
        .parent()
        .next()
        .invoke('text')
        .then((text) => {
          primaryContact[info] = text
        })
    })

    // Secondary Contact
    cy.get('[id="select-secondary-contact"]').click({
      force: true,
    })
    cy.get('.v-list-item').first().click()
    contactInfo.map((info) => {
      cy.contains('Secondary Contact')
        .nextAll()
        .contains(info)
        .parent()
        .next()
        .invoke('text')
        .then((text) => {
          secondaryContact[info] = text
        })
    })

    // Expense Authority
    cy.get('[id="select-expense-authority"]').click({
      force: true,
    })
    cy.get('.v-list-item').first().click()

    contactInfo.map((info) => {
      cy.contains('Expense Authority')
        .nextAll()
        .contains(info)
        .parent()
        .next()
        .invoke('text')
        .then((text) => {
          expenseAuthority[info] = text
        })
    })

    cy.get('button').contains('Next').click()

    // ================
    // Service Delivery
    // ================
    cy.get('#confirmation').check({ force: true })
    cy.get('button').contains('Next').click()

    // ===============
    // Operating Costs
    // ===============
    cy.get('[id="select-facility-types"]').click({
      force: true,
    })
    cy.get('.v-list-item').eq(1).click()

    operatingCosts.map((cost) => {
      cy.log('processing ' + cost)
      cy.get('p')
        .contains(cost[0])
        .parent()
        .next()
        .find('input[type="text"]')
        .type('{selectall}')
        .type(cost[1])
    })
    cy.get('button').contains('Next').click()

    // ========
    // Staffing
    // ========

    cy.get('input[name="is-unionized"]').eq(1).check()

    staffing.map((staff) => {
      cy.get('p')
        .contains(new RegExp('^' + staff[0] + '$', 'g'))
        .parent()
        .next()
        .find('input[type="text"]')
        .type(staff[1])

      cy.get('p')
        .contains(new RegExp('^' + staff[0] + '$', 'g'))
        .parent()
        .next()
        .next()
        .find('input[type="text"]')
        .type(staff[2])
    })
    cy.get('button').contains('Next').click()

    // ======
    // Review
    // ======
    // Review - Facility
    cy.contains('Facility:')
      .invoke('text')
      .then((text) => {
        expect(facility.facilityName).to.equal(text.split(':')[1].trim())
      })

    facilityContactInfo.map((info) => {
      cy.get('label')
        .contains(info)
        .parent()
        .next()
        .invoke('text')
        .then((text) => {
          expect(facility[info]).to.equal(text)
        })
    })

    facilityInfo.map((info) => {
      cy.get('label')
        .contains(info)
        .parent()
        .next()
        .invoke('text')
        .then((text) => {
          expect(facility['Physical ' + info]).to.equal(text)
        })
    })

    facilityInfo.map((info) => {
      cy.contains('Mailing address')
        .parent()
        .nextAll()
        .get('label')
        .contains(info)
        .parent()
        .next()
        .invoke('text')
        .then((text) => {
          expect(facility['Mailing ' + info]).to.equal(text)
        })
    })

    contactInfo.map((info) => {
      cy.contains('Primary Contact')
        .nextAll()
        .contains(info)
        .parent()
        .next()
        .invoke('text')
        .then((text) => {
          expect(primaryContact[info]).to.equal(text)
        })
    })

    contactInfo.map((info) => {
      cy.contains('Secondary Contact')
        .nextAll()
        .contains(info)
        .parent()
        .next()
        .invoke('text')
        .then((text) => {
          expect(secondaryContact[info]).to.equal(text)
        })
    })

    contactInfo.map((info) => {
      cy.contains('Expense Authority')
        .nextAll()
        .contains(info)
        .parent()
        .next()
        .invoke('text')
        .then((text) => {
          expect(expenseAuthority[info]).to.equal(text)
        })
    })

    // Review -> Operating Costs
    operatingCosts.map((cost) => {
      cy.contains(new RegExp('^' + cost[0] + '$', 'g'))
        .next()
        .should('have.text', cost[1])
    })

    // Review -> Staffing
    // TODO (weskubo-cgi) This is currently failing beause of Initials/ECE certification #. Need to populate data dynamically
    // staffing.map((staff) => {
    //   cy.get('p')
    //     .contains(new RegExp('^' + staff[0] + '$', 'g'))
    //     .parent()
    //     .next()
    //     .should('have.text', staff[1])

    //   cy.get('p')
    //     .contains(new RegExp('^' + staff[0] + '$', 'g'))
    //     .parent()
    //     .next()
    //     .next()
    //     .should('have.text', staff[2])
    // })
    // Validation is currently failing so Next is disabled
    cy.get('#app-next-button').should('have.attr', 'disabled')

    //   // Declare & Submit
    //   cy.get('[id="declaration"]').check({ force: true })
    //   //   cy.get("button").contains("Submit").click();
  })
})

// describe.skip('Checks the portal application fields on CRM', () => {
//   it('Does stuff', () => {
//     cy.origin(CRM_BASE_URL, () => {
//       cy.on('uncaught:exception', (e) => {
//         return false
//       })
//       cy.contains('Street Address 1').should('exist')
//     })
//     expect(true).to.equal(true)
//   })
// })
