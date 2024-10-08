const USERNAME = Cypress.env("PORTAL_USERNAME");
const PASSWORD = Cypress.env("PORTAL_PASSWORD");
const PORTAL_URL = Cypress.env("PORTAL_URL");

describe("Notifications", () => {
  beforeEach(() => {
    cy.loginToPortal(USERNAME, PASSWORD, PORTAL_URL);
    cy.visit(PORTAL_URL);
    cy.get('button[id="mail_box_button"]').click();
    cy.get("button").contains("Notifications").click();
  });

  it("view notifications ", () => {
    cy.get("#notifications-table")
      .find("tbody > tr")
      .should("have.length.at.least", 2);

    cy.get("table").first().find("tr").eq(2).click({ force: true });

    // Validate Read/Unread in the table is Unread
    cy.get("table").first().find("tr").eq(2).contains("Read");

    // Validate From: text
    cy.get('div[class*="notification-from-text"]').should(
      "contain.text",
      "$10 a Day Funding Program"
    );

    // Validate Mark Unread button shows
    cy.get("span").contains("Mark Unread").should("exist");

    // Validate content
    cy.get('div[class*="notification-content"]').should("not.be.empty");
  });

  it("mark message unread", () => {
    // Click the row
    cy.get("table").first().find("tr").eq(2).click({ force: true });

    // Validate Mark Unread button shows
    cy.get("span")
      .contains("Mark Unread")
      .should("exist")
      .click({ force: true });

    // Validate Mark Unread button is hidden
    cy.get("span").contains("Mark Read").should("not.exist");

    // Validate Read/Unread in the table is Unread
    cy.get("table").first().find("tr").eq(2).contains("Unread");
  });
});
