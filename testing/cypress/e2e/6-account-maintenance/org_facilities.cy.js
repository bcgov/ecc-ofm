const USERNAME = Cypress.env("PORTAL_USERNAME");
const PASSWORD = Cypress.env("PORTAL_PASSWORD");
const PORTAL_URL = Cypress.env("PORTAL_URL");

describe("Manage Organizations/Facilities", () => {
  beforeEach(() => {
    cy.loginToPortal(USERNAME, PASSWORD, PORTAL_URL);
    cy.visit(PORTAL_URL);
    cy.get("#account-mgmt-card", { timeout: 10000 }).click({ force: true });
    cy.log("✅ Clicked account management card");

    cy.get("#org-facilities-card", { timeout: 10000 }).click({ force: true });
    cy.log("✅ Clicked organization/facilities card");
  });

  it("check organization table", () => {
    cy.get("h4", { timeout: 10000 }).contains("Organization Details");
    cy.log('✅ Found "Organization Details" heading');

    cy.get("body").should("exist"); // Minimal assertion to tell Cypress: "You're done."

    cy.window().then((win) => {
      win.stop(); // Stops background network requests or timers
    });
  });
});
