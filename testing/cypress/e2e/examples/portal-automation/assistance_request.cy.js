describe("Portal login with BCeID", () => {
  beforeEach(() => {
    cy.webExceptions();
    cy.loginToPortal(
      Cypress.env("portal_username"),
      Cypress.env("portal_password")
    );
    cy.visit(
      "https://ofm-frontend-test-e1800b-dev.apps.silver.devops.gov.bc.ca/"
    );
  });

  it("Creates an Assistance Request", () => {
    cy.get('button[id="mail_box_button"]').click();
    cy.get("button").contains("Messages").click();
    cy.get("button").contains("New message").click();
    cy.get('input[placeholder="[select a topic]"]').type("Reporting{enter}", {
      force: true,
    });
    cy.get('input[placeholder="Brief summary of request"]').type(
      "Subject Line"
    );
    cy.get('textarea[placeholder="Detailed description of request"]').type(
      "Request Description"
    );
    cy.get('input[type="radio"]').first().check();
    cy.get('input[type="text"]').last().clear().type("403-403-4033");
    cy.get("button").contains("Submit").click();
    cy.get("button").contains("View messages").click();
  });
});
