describe("Azure Active Directory Authentication", () => {
  beforeEach(() => {
    // log into Azure Active Directory through our sample SPA using our custom command
    cy.loginToAAD(Cypress.env("aad_username"), Cypress.env("aad_password"));
    cy.wait(1000);
    cy.contains("Dynamics 365").should("exist");
  });

  it("checks nothing", () => {
    expect(true).to.be.equal(true);
    cy.wait(200000);
  });
  //   it("verifies the user logged in has the correct name", () => {
  //     cy.get('#table-body-div td:contains("name") + td').should(
  //       "contain",
  //       `${Cypress.env("aad_name")}`
  //     );
  //   });

  //   it("verifies the user logged in has the correct preferred name", () => {
  //     cy.get('#table-body-div td:contains("preferred_username") + td').should(
  //       "contain",
  //       `${Cypress.env("aad_username")}`
  //     );
  //   });
});
