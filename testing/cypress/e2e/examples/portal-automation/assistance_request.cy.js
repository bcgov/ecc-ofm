describe("Portal Assistance Request", () => {
  beforeEach(() => {
    cy.loginToPortal(
      Cypress.env("portal_username"),
      Cypress.env("portal_password")
    );
    cy.visit(
      "https://ofm-frontend-test-e1800b-dev.apps.silver.devops.gov.bc.ca/"
    );
    cy.get('button[id="mail_box_button"]').click();
    cy.get("button").contains("Messages").click();
  });

  it("Creates an Assistance Request with a Phone Number", () => {
    // input fields
    let topic = "Reporting";
    let subject = "Subject Line";
    let description = "Description Line";

    // make the assistance request
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

    cy.get("p")
      .contains("Reference: REQ")
      .invoke("text")
      .then((text) => {
        let reqId = text.split(":")[1].trim();
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
          .contains("Reference#")
          .next()
          .should("have.text", reqId);
        cy.get("div[data-v-74bb8dab]")
          .contains("Topic")
          .next()
          .should("have.text", topic);
        cy.contains(description).should("exist");
      });
  });

  it("Checks that topic, subject, and request description are mandatory", () => {
    cy.get("button").contains("New message").click();

    // checks that topic is mandatory
    cy.get('input[placeholder="Brief summary of request"]').type("subject");
    cy.get('textarea[placeholder="Detailed description of request"]').type(
      "description"
    );
    cy.get("button").contains("Submit").click();
    cy.contains("This field is required").should("exist");

    // checks that the subject is mandatory
    cy.get('input[placeholder="[select a topic]"]').type(`Reporting{enter}`, {
      force: true,
    });
    cy.get('input[placeholder="Brief summary of request"]').clear();
    cy.get("button").contains("Submit").click();
    cy.contains("This field is required").should("exist");

    // checks that the description is mandatory
    cy.get('input[placeholder="Brief summary of request"]').type("subject");
    cy.get('textarea[placeholder="Detailed description of request"]').clear();
    cy.get("button").contains("Submit").click();
    cy.contains("This field is required").should("exist");
  });

  it("Checks that the portal message radio is selected at the start", () => {
    cy.get("button").contains("New message").click();
    cy.get('input[type="radio"]').last().should("be.checked");
  });

  it("Lets you cancel the application", () => {
    cy.get("button").contains("New message").click();
    cy.get("button").contains("Cancel").click();
  });

  it("Checks the different topics available", () => {
    // Intake & Renewal
    cy.get("button").contains("New message").click();
    cy.get('div[class="v-field__input"]').first().as("topic");
    cy.get("@topic").click({ force: true });
    cy.get(".v-list-item__content").contains("Intake & Renewal").click();
    cy.contains("Intake & Renewal", { force: true }).should("exist");

    // Reporting
    cy.get("@topic").click({ force: true });
    cy.get(".v-list-item__content").contains("Reporting").click();
    cy.contains("Reporting", { force: true }).should("exist");

    // Account Maintenance
    cy.get("@topic").click({ force: true });
    cy.get(".v-list-item__content").contains("Account Maintenance").click();
    cy.contains("Account Maintenance", { force: true }).should("exist");

    // Funding Agreement
    cy.get("@topic").click({ force: true });
    cy.get(".v-list-item__content").contains("Funding Agreement").click();
    cy.contains("Funding Agreement", { force: true }).should("exist");

    // Payments and Funding
    cy.get("@topic").click({ force: true });
    cy.get(".v-list-item__content").contains("Payments and Funding").click();
    cy.contains("Payments and Funding", { force: true }).should("exist");

    // Policy Question
    cy.get("@topic").click({ force: true });
    cy.get(".v-list-item__content").contains("Policy Question").click();
    cy.contains("Policy Question", { force: true }).should("exist");

    // Technical Support
    cy.get("@topic").click({ force: true });
    cy.get(".v-list-item__content").contains("Technical Support").click();
    cy.contains("Technical Support", { force: true }).should("exist");

    // Other
    cy.get("@topic").click({ force: true });
    cy.get(".v-list-item__content").contains("Other").click();
    cy.contains("Other", { force: true }).should("exist");
  });

  it("Checks 100 max character count in the subject", () => {
    let word105 =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

    cy.get("button").contains("New message").click();
    cy.get('input[placeholder="Brief summary of request"]').type(word105);
    cy.get('input[placeholder="Brief summary of request"]')
      .invoke("val")
      .then((val) => {
        expect(val).to.have.length(100);
      });
  });

  it("Checks 1000 max character count in the description", () => {
    let word1005 =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

    cy.get("button").contains("New message").click();
    cy.get('textarea[placeholder="Detailed description of request"]').type(
      word1005
    );
    cy.get('textarea[placeholder="Detailed description of request"]')
      .invoke("val")
      .then((val) => {
        expect(val).to.have.length(1000);
      });
  });

  it("Allows you to select multiple facilities", () => {
    cy.get("button").contains("New message").click();
    cy.get('input[id="selectFacility"]').click({ force: true });
    cy.get(".v-list-item__content").contains("Select All").click();
  });
});
