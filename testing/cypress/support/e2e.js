import "./commands";

// add cypress log into CRM command
Cypress.Commands.add("loginToAAD", (username, password, crmUrl, crmBaseUrl) => {
  loginViaAAD(username, password, crmUrl, crmBaseUrl);
});

// add cypress log into Portal command
Cypress.Commands.add("loginToPortal", (username, password, portalUrl) => {
  loginViaPortal(username, password, portalUrl);
});

// CRM log in function
function loginViaAAD(username, password, crmUrl, crmBaseUrl) {
  // create CRM seesion
  cy.session([username, password], () => {
    cy.visit(crmUrl);

    cy.origin(crmBaseUrl, () => {
      cy.on("uncaught:exception", (e) => {
        if (e.message.includes(" ")) {
          return false;
        }
      });
    });

    // enter username and submit
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

    // enter password and submit
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
        cy.get('input[type="button"]').click();
      }
    );
  });
}

// Portal log in function
function loginViaPortal(username, password, portalUrl) {
  // visit portal log in page
  cy.visit(portalUrl);

  // click on log in button
  cy.origin(portalUrl, () => {
    cy.get('a[id="bceid-login"]').click();
  });

  // enter username
  cy.origin(
    "https://logontest7.gov.bc.ca",
    { args: { username } },
    ({ username }) => {
      cy.get('input[id="user"]', { timeout: 3000 }).type(username);
    }
  );

  // enter password and submit
  cy.origin(
    "https://logontest7.gov.bc.ca",
    {
      args: {
        password,
      },
    },
    ({ password }) => {
      cy.get('input[id="password"]').type(password);
      cy.get('input[type="submit"]').click();
    }
  );
}
