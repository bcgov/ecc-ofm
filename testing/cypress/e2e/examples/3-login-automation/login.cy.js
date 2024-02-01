describe("Azure Active Directory Authentication", () => {
  beforeEach(() => {
    // log into Azure Active Directory through our sample SPA using our custom command
    cy.webExceptions();
    cy.visit("https://google.ca");
    cy.loginToAAD(Cypress.env("aad_username"), Cypress.env("aad_password"));
    cy.visit(
      "https://mychildcareservicesdev.crm3.dynamics.com/main.aspx?appid=af54cb40-d463-ee11-8df0-000d3a09d499"
    );
  });

  it("does nothing", () => {
    cy.origin("https://mychildcareservicesdev.crm3.dynamics.com", () => {
      cy.get('ul[aria-label="Case Management"]')
        .contains("Assistance Requests")
        .click();
      cy.get('button[aria-label="New"]').click();
      cy.get('input[aria-label="Subject"]').type("Subject stuff");
    });

    expect(true).to.equal(true);
  });
});
