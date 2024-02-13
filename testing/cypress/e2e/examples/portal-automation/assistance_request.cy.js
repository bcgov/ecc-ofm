describe("Portal Assistance Request", () => {
  beforeEach(() => {
    cy.loginToPortal(
      Cypress.env("portal_username"),
      Cypress.env("portal_password")
    );
    cy.visit(
      "https://ofm-frontend-test-e1800b-dev.apps.silver.devops.gov.bc.ca/"
    );
  });

  it("Creates an Assistance Request", () => {
    // input fields
    let topic = "Reporting";
    let subject = "Subject Line";
    let description = "Description Line";

    // make the assistance request
    cy.get('button[id="mail_box_button"]').click();
    cy.get("button").contains("Messages").click();
    cy.get("button").contains("New message").click();
    cy.get('input[placeholder="[select a topic]"]').type(`${topic}{enter}`, {
      force: true,
    });
    cy.get('input[placeholder="Brief summary of request"]').type(subject);
    cy.get('textarea[placeholder="Detailed description of request"]').type(
      description
    );
    cy.get('input[type="radio"]').first().check();
    cy.get('input[type="text"]').last().clear().type("403-403-4033");
    cy.get("button").contains("Submit").click();
    cy.get("button").contains("View messages").click();
    cy.get("table").last().find("tr").eq(2).click({ force: true });

    // confirm that the portal's assistance request has the right information submitted in the form for the assistance request
    cy.contains("Reply").parent().should("have.class", "reply-disabled");
    cy.get("div[data-v-74bb8dab]")
      .find('span[class="subject-header"]')
      .should("include.text", subject);
    cy.get("div[data-v-74bb8dab]")
      .contains("Status")
      .next()
      .should("have.text", "Open");
    cy.get("div[data-v-74bb8dab]")
      .contains("Topic")
      .next()
      .should("have.text", topic);
    cy.contains(description).should("exist");
  });
});
