const AAD_USERNAME = Cypress.env('aad_username')
const AAD_PASSWORD = Cypress.env('aad_password')
const CRM_URL = Cypress.env('crm_url')
const CRM_BASE_URL = Cypress.env('crm_base_url')

describe.skip('Login to CRM via AAD', () => {
  it('successful login', () => {
    cy.webExceptions(CRM_BASE_URL)
    cy.visit('https://google.ca')
    cy.loginToAAD(AAD_USERNAME, AAD_PASSWORD, CRM_URL, CRM_BASE_URL)
    cy.visit(CRM_URL)
  })

  it('failed login', () => {
    cy.webExceptions(CRM_BASE_URL)
    cy.visit('https://google.ca')
    cy.loginToAAD('doesnotexist', 'password', CRM_URL, CRM_BASE_URL)
    cy.visit(CRM_URL)
  })
})
