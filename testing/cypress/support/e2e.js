// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

function loginViaAAD(username, password) {
  cy.visit(
    "https://mychildcareservicesdev.crm3.dynamics.com/main.aspx?appid=733af835-f8da-4763-b4ab-972ebdc95f65"
  );

  cy.origin(
    "login.microsoftonline.com",
    {
      args: {
        username,
      },
    },
    ({ username }) => {
      cy.get('input[type="email"]').type(username, {
        log: false,
      });
      cy.get('input[type="submit"]').click();
    }
  );

  // depending on the user and how they are registered with Microsoft, the origin may go to live.com
  cy.origin(
    "login.microsoftonline.com",
    {
      args: {
        password,
      },
    },
    ({ password }) => {
      cy.get('input[type="password"]').type(password, {
        log: false,
      });
      cy.get('input[type="submit"]').click();
      cy.get("#idBtn_Back").click();
    }
  );
}

function loginToPortal(username, password) {
  cy.visit(
    "https://ofm-frontend-test-e1800b-dev.apps.silver.devops.gov.bc.ca/"
  );
  cy.get('a[id="bceid-login"]').click();
  cy.wait(3000);

  // brought to the BCeID login page
  cy.get('input[id="user"]').type(username);
  cy.get('input[id="password"]').type(password);
  cy.get('input[type="submit"]').contains("Continue").click();
}

Cypress.Commands.add("loginToAAD", (username, password) => {
  cy.session(
    `aad${username}`,
    () => {
      const log = Cypress.log({
        displayName: "Azure Active Directory Login",
        message: [`🔐 Authenticating | ${username}`],
        autoEnd: false,
      });
      log.snapshot("before");

      loginViaAAD(username, password);

      log.snapshot("after");
      log.end();
    },
    {
      validate: () => {
        cy.visit(
          "https://mychildcareservicesdev.crm3.dynamics.com/main.aspx?appid=af54cb40-d463-ee11-8df0-000d3a09d499"
        );
        cy.origin("https://mychildcareservicesdev.crm3.dynamics.com", () => {
          cy.contains("Dynamics 365").should("be.visible");
          cy.contains("Operating Funding Model").should("be.visible");
        });
      },
    }
  );
});

Cypress.Commands.add("loginToPortal", (username, password) => {
  cy.session(
    `portal-${username}`,
    () => {
      const log = Cypress.log({
        displayName: "Portal Login",
        message: [`🔐 Authenticating | ${username}`],
        autoEnd: false,
      });
      log.snapshot("before");

      loginToPortal(username, password);

      log.snapshot("after");
      log.end();
    },
    {
      validate: () => {
        cy.visit(
          "https://ofm-frontend-test-e1800b-dev.apps.silver.devops.gov.bc.ca/"
        );
        cy.contains("Operating Funding Model").should("exist");
      },
    }
  );
});
