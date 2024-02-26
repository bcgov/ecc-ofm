describe("Portal Assistance Request", () => {
  beforeEach(() => {
    const USERNAME = Cypress.env("portal_username");
    const PASSWORD = Cypress.env("portal_password");
    const PORTAL_URL = Cypress.env("portal_url");

    cy.loginToPortal(USERNAME, PASSWORD, PORTAL_URL);
    cy.visit(PORTAL_URL);
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
    cy.get('textarea[placeholder^="Detailed description"]').type(description);
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
    cy.get("label")
      .contains("Topic")
      .parent()
      .next()
      .contains("This field is required")
      .should("exist");

    // checks that the subject is mandatory
    cy.get('input[placeholder="[select a topic]"]').type(`Reporting{enter}`, {
      force: true,
    });
    cy.get('input[placeholder="Brief summary of request"]').clear();
    cy.get("button").contains("Submit").click();
    cy.get("label")
      .contains("Subject")
      .parent()
      .next()
      .contains("This field is required")
      .should("exist");

    // checks that the description is mandatory
    cy.get('input[placeholder="Brief summary of request"]').type("subject");
    cy.get('textarea[placeholder="Detailed description of request"]').clear();
    cy.get("button").contains("Submit").click();
    cy.get("label")
      .contains("Request description")
      .parent()
      .next()
      .contains("This field is required")
      .should("exist");
  });

  it("Checks that the portal message radio is selected at the start", () => {
    cy.get("button").contains("New message").click();
    cy.get("label")
      .contains("Portal message")
      .prev()
      .find('input[type="radio"]')
      .should("be.checked");
  });

  it("Lets you cancel the application", () => {
    cy.get("button").contains("New message").click();
    cy.get("button").contains("Cancel").click();
  });

  it("Checks the different topics available", () => {
    const topics = [
      "Intake & Renewal",
      "Reporting",
      "Account Maintenance",
      "Funding Agreement",
      "Payments and Funding",
      "Policy Question",
      "Technical Support",
      "Other",
    ];

    cy.get("button").contains("New message").click();
    cy.get('div[class="v-field__input"]').first().as("topic");

    for (let i = 0; i < topics.length; i++) {
      cy.get("@topic").click({ force: true });
      cy.get(".v-list-item__content").contains(topics[i]).click();
      cy.contains(topics[i], { force: true }).should("exist");
    }
  });

  it("Checks 100 max character count in the subject", () => {
    let word105 =
      " testing 105 characters - aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ";

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
      " testing 1005 characters - aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ";

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
    cy.get(".v-list-item").contains("Select All").click();
    cy.get('input[id="selectFacility"]')
      .parent()
      .get('*[class="v-select__selection"]')
      .should("have.length.at.least", 2);
  });
});
