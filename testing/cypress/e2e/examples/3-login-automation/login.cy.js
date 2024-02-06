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

  it("goes to an organization", () => {
    cy.origin("https://mychildcareservicesdev.crm3.dynamics.com", () => {
      cy.on("uncaught:exception", (e) => {
        return false;
      });

      cy.get('ul[aria-label="Childcare Providers"]')
        .contains("Organization-Facilities")
        .click();
      cy.get(
        'input[aria-label="Organization-Facility Filter by keyword"]'
      ).type("Test-1088 Organization{enter}");
      cy.wait(5000);
      cy.get('div[row-index="0"]')
        .find('input[type="checkbox"]')
        .click({ force: true });
      cy.get('ul[aria-label="Organization-Facility Commands"]')
        .find("button")
        .contains("Edit")
        .click();
    });

    expect(true).to.equal(true);
  });
});
