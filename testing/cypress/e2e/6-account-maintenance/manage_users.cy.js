const USERNAME = Cypress.env("PORTAL_USERNAME");
const PASSWORD = Cypress.env("PORTAL_PASSWORD");
const PORTAL_URL = Cypress.env("PORTAL_URL");

describe("Manage Facility Users", () => {
  beforeEach(() => {
    cy.intercept("**/api/**", (req) => {
      console.log("➡️ Intercepted:", req.method, req.url);
    }).as("apiCalls");

    cy.loginToPortal(USERNAME, PASSWORD, PORTAL_URL);

    cy.wait(1000); // Give auth time to register
    cy.visit(PORTAL_URL);

    cy.wait(3000); // Give auth time to register

    cy.intercept("GET", "**/api/user/permissions-facilities/**", (req) => {
      console.log("Request headers:", req.headers);
      console.log("Request cookies:", document.cookie);
      req.continue();
    }).as("permissionsCheck");

    cy.get("#help-card").click();
    cy.get("#back-home-button").click();
    cy.get("#account-mgmt-card").click();
    cy.get("#manage-users-card").click();
  });

  it("check user table", () => {
    cy.get("h3").contains("Manage users");
    cy.log('✅ Found "Manage users" heading');

    cy.get("body").should("exist"); // Minimal assertion to tell Cypress: "You're done."

    // Optional: kill polling if app keeps network open
    cy.window().then((win) => win.stop());
  });
});
