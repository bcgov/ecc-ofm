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
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

function loginViaAAD(username, password, crmUrl) {
  cy.visit(crmUrl)

  cy.origin(
    'login.microsoftonline.com',
    {
      args: {
        username,
      },
    },
    ({ username }) => {
      cy.get('input[type="email"]').type(username, {
        log: false,
      })
      cy.get('input[type="submit"]').click()
    }
  )

  // depending on the user and how they are registered with Microsoft, the origin may go to live.com
  cy.origin(
    'login.microsoftonline.com',
    {
      args: {
        password,
      },
    },
    ({ password }) => {
      cy.get('input[type="password"]').type(password, {
        log: false,
      })
      cy.get('input[type="submit"]').click()
      cy.get('#idBtn_Back').click()
    }
  )
}

function loginToPortal(username, password, portalUrl) {
  cy.visit(portalUrl)
  cy.get('a[id="bceid-login"]').click()

  // brought to the BCeID login page

  cy.get('input[id="user"]', { timeout: 10000 }).type(username)
  cy.get('input[id="password"]').type(password)
  cy.get('input[type="submit"]').contains('Continue').click()
}

Cypress.Commands.add('loginToAAD', (username, password, crmUrl, crmBaseUrl) => {
  cy.session(
    `aad-${username}`,
    () => {
      const log = Cypress.log({
        displayName: 'Azure Active Directory Login',
        message: [`🔐 Authenticating | ${username}`],
        autoEnd: false,
      })
      log.snapshot('before')

      loginViaAAD(username, password, crmUrl)

      log.snapshot('after')
      log.end()
    },
    {
      validate: () => {
        cy.visit(crmUrl)
        cy.origin(crmBaseUrl, () => {
          cy.contains('Dynamics 365').should('be.visible')
          cy.contains('Operating Funding Model').should('be.visible')
        })
      },
    }
  )
})

Cypress.Commands.add('loginToPortal', (username, password, portalUrl) => {
  cy.session(
    `portal-${username}`,
    () => {
      const log = Cypress.log({
        displayName: 'Portal Login',
        message: [`🔐 Authenticating | ${username}`],
        autoEnd: false,
      })
      log.snapshot('before')

      loginToPortal(username, password, portalUrl)

      log.snapshot('after')
      log.end()
    },
    {
      validate: () => {
        cy.visit(portalUrl)
        cy.contains(username).should('exist')
        cy.contains('$10 a Day ChildCareBC Centres').should('exist')
      },
    }
  )
})

Cypress.Commands.add(
  'loginToPortalNoSession',
  (username, password, portalUrl) => {
    loginToPortal(username, password, portalUrl)
  }
)

// Added to workaround exceptions that *may* be generated from SSO
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
