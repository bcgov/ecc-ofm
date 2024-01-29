describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://ofm-frontend-test-e1800b-dev.apps.silver.devops.gov.bc.ca/login')

    cy.get('[id=bceid-login]').click()
    cy.wait(500)
    cy.get('[id=user]').type('ofmqa11')
    cy.get('[id=password]').type('WelcomeQA11')
    cy.get('[name=btnSubmit]').click()
  })
})