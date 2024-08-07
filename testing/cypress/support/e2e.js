import './commands'

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

      loginViaPortal(username, password, portalUrl)

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

// add cypress log into CRM command
Cypress.Commands.add(
  'loginToAADNoSession',
  (username, password, crmUrl, crmBaseUrl) => {
    loginViaAADNoSession(username, password, crmUrl, crmBaseUrl)
  }
)
Cypress.Commands.add(
  'loginToPortalNoSession',
  (username, password, portalUrl) => {
    loginViaPortal(username, password, portalUrl)
  }
)

// CRM log in function without session
function loginViaAADNoSession(username, password, crmUrl, crmBaseUrl) {
  // create CRM seesion
  cy.visit(crmUrl)

  cy.origin(crmBaseUrl, () => {
    cy.on('uncaught:exception', (e) => {
      if (e.message.includes(' ')) {
        return false
      }
    })
  })

  // enter username and submit
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

  // enter password and submit
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
      cy.get('input[type="button"]').click()
    }
  )
}

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

function loginViaPortal(username, password, portalUrl) {
  cy.visit(portalUrl)
  cy.get('a[id="bceid-login"]').click()

  // brought to the BCeID login page
  cy.get('input[id="user"]', { timeout: 10000 }).type(username)
  cy.get('input[id="password"]').type(password)
  cy.get('input[type="submit"]').contains('Continue').click()
}
