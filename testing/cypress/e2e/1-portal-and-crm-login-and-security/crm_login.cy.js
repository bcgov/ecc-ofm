const AAD_USERNAME = Cypress.env('aad_username')
const AAD_PASSWORD = Cypress.env('aad_password')
const CRM_URL = Cypress.env('crm_url')
const CRM_BASE_URL = Cypress.env('crm_base_url')

describe('Login to CRM via AAD', () => {
  it('successful login', () => {
    cy.webExceptions(CRM_BASE_URL)
    cy.visit('https://google.ca')
    cy.loginToAAD(AAD_USERNAME, AAD_PASSWORD, CRM_URL, CRM_BASE_URL)
    cy.visit(CRM_URL)
    cy.origin(CRM_BASE_URL, { args: { AAD_USERNAME } }, ({ AAD_USERNAME }) => {
      // Validate title
      cy.get('span[data-id="warningNotification"]')
        .contains('You have logged in Operation Funding Model - Dev .')
        .should('exist')

      // Click the header picture
      cy.get('#mectrl_main_trigger').click()

      // Validate username
      cy.get('#mectrl_currentAccount_secondary').should(
        'have.text',
        AAD_USERNAME
      )
    })
  })

  it.skip('failed login', () => {
    cy.webExceptions(CRM_BASE_URL)
    cy.visit('https://google.ca')
    cy.loginToAAD('doesnotexist@gov.bc.ca', 'password', CRM_URL, CRM_BASE_URL)

    // Validate urror
    cy.get('div[role="alert"]')
      .contains(
        'This username may be incorrect. Make sure you typed it correctly. Otherwise, contact your admin.'
      )
      .should('exist')
    cy.visit(CRM_URL)
  })
})
