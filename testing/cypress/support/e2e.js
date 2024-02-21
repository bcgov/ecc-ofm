import "./commands";

// add cypress log into CRM command
Cypress.Commands.add("loginToAAD", (username, password) => {
  loginViaAAD(username, password);
});

// add cypress log into Portal command
Cypress.Commands.add("loginToPortal", (username, password) => {
  loginViaPortal(username, password);
});

// CRM log in function
function loginViaAAD(username, password) {
  // create CRM seesion
  cy.session([username, password], () => {
    cy.visit(
      "https://mychildcareservicesdev.crm3.dynamics.com/main.aspx?appid=af54cb40-d463-ee11-8df0-000d3a09d499&pagetype=dashboard&id=4d508c50-eb78-ee11-8179-000d3a09d699&type=system&_canOverride=true"
    );

    cy.origin("https://mychildcareservicesdev.crm3.dynamics.com", () => {
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
function loginViaPortal(username, password) {
  // visit portal log in page
  cy.visit(
    "https://ofm-frontend-test-e1800b-dev.apps.silver.devops.gov.bc.ca/login"
  );

  // click on log in button
  cy.origin(
    "https://ofm-frontend-test-e1800b-dev.apps.silver.devops.gov.bc.ca/",
    () => {
      cy.get('a[id="bceid-login"]').click();
    }
  );

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
