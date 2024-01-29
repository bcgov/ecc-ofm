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
  cy.visit("https://google.ca");
  cy.visit(
    "https://mychildcareservicesdev.crm3.dynamics.com/main.aspx?appid=733af835-f8da-4763-b4ab-972ebdc95f65&forceUCI=1&pagetype=dashboard&id=dd6fd3f1-1e2d-ed11-9db0-000d3af4f2d7&type=system&_canOverride=true"
  );
  cy.origin(
    "login.microsoftonline.com",
    {
      args: {
        username,
        password,
      },
    },
    ({ username, password }) => {
      cy.get('input[type="email"]').type(username, {
        log: false,
      });
      cy.get('input[type="submit"]')
        .click()
        .then(($password) => {
          cy.get('input[type="password"]').type(password, {
            log: false,
          });
          cy.get('input[type="submit"]')
            .click()
            .then(() => {
              cy.get("#idBtn_Back").click();
            });
        });
    }
  );

  cy.origin("https://mychildcareservicesdev.crm3.dynamics.com", () => {
    cy.get('button[id="okButton_1').click();
  });

  cy.wait(30000);
  cy.reload();
}

Cypress.Commands.add("loginToAAD", (username, password) => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false;
  });

  const log = Cypress.log({
    displayName: "Azure Active Directory Login",
    message: [`🔐 Authenticating | ${username}`],
    autoEnd: false,
  });
  log.snapshot("before");

  loginViaAAD(username, password);

  log.snapshot("after");
  log.end();
});
