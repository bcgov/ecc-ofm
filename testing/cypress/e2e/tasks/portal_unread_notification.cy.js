describe("OFM Portal", () => {
  const ADD_USERNAME = Cypress.env("aad_username");
  const ADD_PASSWORD = Cypress.env("aad_password");
  const CRM_URL = Cypress.env("crm_url");
  const CRM_BASE_URL = Cypress.env("crm_base_url");
  const PORTAL_URL = Cypress.env("portal_url");

  beforeEach(() => {
    // log into CRM
    cy.visit("www.google.ca");
    cy.loginToAAD(ADD_USERNAME, ADD_PASSWORD, CRM_URL, CRM_BASE_URL);
  });

  it("Log into CRM and create notification", () => {
    cy.visit(CRM_URL);
    cy.origin(CRM_BASE_URL, () => {
      cy.on("uncaught:exception", (e) => {
        if (e.message.includes(" ")) {
          return false;
        }
      });

      // click on notifications
      cy.get("#sitemap-entity-NewSubArea_b568f1b1", { timeout: 20000 })
        .should("be.visible")
        .click();

      // click on email button
      cy.get('button[title="Email"]', { timeout: 10000 })
        .first()
        .should("be.visible")
        .click();

      // input the contact field
      cy.get('button[title="Search"]', { timeout: 5000 })
        .eq(1)
        .click()
        .wait(1000)
        .type("ofmqa05");
      cy.contains("qa05", { timeout: 20000 }).should("be.visible").click();

      // enter the subject
      cy.get('input[aria-label="Subject"]')
        .click()
        .clear()
        .type("Automation Test - Subject");

      // select communication type
      cy.get('button[title="Search"]').eq(2).click();
      cy.contains("Action Required").click();

      // click save
      cy.get('button[aria-label="Save (CTRL+S)"]').click();

      // change activity status
      cy.get('button[title="More Header Editable Fields"]').click();
      cy.get('select[title="Open"]').select("Completed");

      // click save
      cy.get('button[aria-label="Save (CTRL+S)"]').click();
    });
  });

  it("Checks if latest message on portal is Unread", () => {
    // log into portal
    cy.loginToPortal(
      Cypress.env("portal_username"),
      Cypress.env("portal_password"),
      Cypress.env("portal_url")
    );

    cy.origin(PORTAL_URL, () => {
      // click on mail icon in top right
      cy.get("#mail_box_button").click();
      // check latest notification is unread
      cy.get("table")
        .find("tr")
        .eq(2)
        .find("td")
        .eq(1)
        .should("have.text", "Unread");
    });
  });

  it("Checks if latest message subject on portal is Automation Test - Subject", () => {
    // log into portal
    cy.loginToPortal(
      Cypress.env("portal_username"),
      Cypress.env("portal_password"),
      Cypress.env("portal_url")
    );

    cy.origin(PORTAL_URL, () => {
      // click on mail icon in top right
      cy.get("#mail_box_button").click();
      // check latest notification's subject
      cy.get("table")
        .find("tr")
        .eq(2)
        .find("td")
        .eq(2)
        .should("have.text", "Automation Test - Subject");
    });
  });
});
