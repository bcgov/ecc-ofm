describe("Azure Active Directory Authentication", () => {
  it("logs in to CRM", () => {
    const AAD_USERNAME = Cypress.env("aad_username");
    const AAD_PASSWORD = Cypress.env("aad_password");
    const CRM_URL = Cypress.env("crm_url");
    const CRM_BASE_URL = Cypress.env("crm_base_url");

    cy.webExceptions(CRM_BASE_URL);
    cy.visit("https://google.ca");
    cy.loginToAAD(AAD_USERNAME, AAD_PASSWORD, CRM_URL, CRM_BASE_URL);
    cy.visit(CRM_URL);
  });
});
