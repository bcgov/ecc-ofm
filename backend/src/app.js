'use strict'

const config = require('./config/index')
const dotenv = require('dotenv')
const log = require('./components/logger')
const morgan = require('morgan')
const session = require('express-session')
const express = require('express')
const atob = require('atob')
const passport = require('passport')
const helmet = require('helmet')
const cors = require('cors')

const auth = require('./components/auth')
const { getRoles } = require('./components/lookup')
const { getUserProfile } = require('./components/user')
const utils = require('./components/utils')

const bodyParser = require('body-parser')
dotenv.config()

const JWTStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const OidcStrategy = require('passport-openidconnect-keycloak-idp').Strategy
const noCache = require('nocache')
const apiRouter = express.Router()
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const configRouter = require('./routes/config')
const documentsRouter = require('./routes/documents')
const healthCheckRouter = require('./routes/healthCheck')
const messageRouter = require('./routes/message')
const notificationRouter = require('./routes/notification')
const applicationsRouter = require('./routes/applications')
const organizationsRouter = require('./routes/organizations')
const fundingAgreementsRouter = require('./routes/fundingAgreements')
const facilitiesRouter = require('./routes/facilities')
const licencesRouter = require('./routes/licences')
const paymentsRouter = require('./routes/payments')
const reportsRouter = require('./routes/reports')
const { MappableObjectForBack } = require('./util/mapping/MappableObject')
const { RoleMappings } = require('./util/mapping/Mappings')
const { getRedisDbSession } = require('./util/redis/redis-client')

const promMid = require('express-prometheus-middleware')

//initialize app
const app = express()
app.set('trust proxy', 1)
//sets security measures (headers, etc)
app.use(cors())
app.use(helmet())
app.use(noCache())
app.use(
  promMid({
    metricsPath: '/api/prometheus',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  }),
)
//tells the app to use json as means of transporting data
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  }),
)

const logStream = {
  write: (message) => {
    log.info(message)
  },
}

const dbSession = String(config.get('redis:enable')) === 'true' ? getRedisDbSession(session) : undefined

const cookie = {
  secure: true,
  httpOnly: true,
  maxAge: 1800000, //30 minutes in ms. this is same as session time. DO NOT MODIFY, IF MODIFIED, MAKE SURE SAME AS SESSION TIME OUT VALUE.
}
if ('local' === config.get('environment')) {
  cookie.secure = false
}
//sets cookies for security purposes (prevent cookie access, allow secure connections only, etc)
app.use(
  session({
    name: 'ofm_cookie',
    secret: config.get('oidc:clientSecret'),
    resave: false,
    saveUninitialized: true,
    cookie: cookie,
    store: dbSession,
  }),
)

//initialize routing and session. Cookies are now only reachable via requests (not js)
app.use(passport.initialize())
app.use(passport.session())

function addLoginPassportUse(discovery, strategyName, callbackURI, kc_idp_hint, clientId, clientSecret) {
  passport.use(
    strategyName,
    new OidcStrategy(
      {
        issuer: discovery.issuer,
        authorizationURL: discovery.authorization_endpoint,
        tokenURL: discovery.token_endpoint,
        userInfoURL: discovery.userinfo_endpoint,
        clientID: config.get(clientId),
        clientSecret: config.get(clientSecret),
        callbackURL: callbackURI,
        scope: 'openid',
        kc_idp_hint: kc_idp_hint,
      },
      async (_iss, profile, _context, idToken, accessToken, refreshToken, verified) => {
        if (typeof accessToken === 'undefined' || accessToken === null || typeof refreshToken === 'undefined' || refreshToken === null) {
          return verified('No access token', null)
        }

        //set access and refresh tokens
        profile.jwtFrontend = await auth.generateUiToken(profile)
        profile.jwt = accessToken
        profile._json = parseJwt(accessToken)
        profile.refreshToken = refreshToken
        profile.idToken = idToken

        // Set additional user info for validation
        await populateUserInfo(profile)

        return verified(null, profile)
      },
    ),
  )
}

async function populateUserInfo(profile) {
  const username = utils.splitUsername(profile.username)
  // Get UserProfile for BCeID users
  if (username.idp === config.get('oidc:idpHintBceid')) {
    // If the userGuid cannot be found in Dynamics, then Dynamics will check if the userName exists,
    // If userName exists but has a null userGuid, the system will update the user record with the GUID and return that user profile.
    const user = await getUserProfile(username.guid, profile._json.bceid_username)

    profile.role = user?.role
    profile.org = user?.organization?.accountid
    profile.contactId = user?.contactid

    profile.facilities = user?.facility_permission.map((fp) => {
      return {
        facilityId: fp.facility.accountid,
        isExpenseAuthority: fp.ofm_is_expense_authority,
      }
    })
  } else if (username.idp === config.get('oidc:idpHintIdir')) {
    const roles = await getRoles()
    const role = roles.find((role) => role.data.roleName === 'Impersonate')

    // Store the role in Dynamics format to match BCeID
    profile.role = new MappableObjectForBack(role.toJSON(), RoleMappings).toJSON()

    // IDIR users don't have an Organization
    // The Org is only assigned in the frontend when impersonating a BCeID user
  }
}

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}
//initialize our authentication strategy
utils.getOidcDiscovery().then((discovery) => {
  // OIDC Strategy is used for authorization
  // XXX We maintain two separate strategies because of the different idpHint. Otherwise they are equivalent.
  addLoginPassportUse(discovery, 'oidcIdir', config.get('server:frontend') + '/api/auth/callback_idir', config.get('oidc:idpHintIdir'), 'oidc:clientId', 'oidc:clientSecret')
  addLoginPassportUse(discovery, 'oidcBceid', config.get('server:frontend') + '/api/auth/callback', config.get('oidc:idpHintBceid'), 'oidc:clientId', 'oidc:clientSecret')

  //JWT strategy is used for authorization  keycloak_bcdevexchange_idir
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        algorithms: ['RS256'],
        // Keycloak 7.3.0 no longer automatically supplies matching client_id audience.
        // If audience checking is needed, check the following SO to update Keycloak first.
        // Ref: https://stackoverflow.com/a/53627747
        audience: config.get('server:frontend'),
        issuer: config.get('tokenGenerate:issuer'),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.get('tokenGenerate:publicKey'),
        ignoreExpiration: true,
      },
      (jwtPayload, done) => {
        if (typeof jwtPayload === 'undefined' || jwtPayload === null) {
          return done('No JWT token', null)
        }

        done(null, {
          email: jwtPayload.email,
          familyName: jwtPayload.family_name,
          givenName: jwtPayload.given_name,
          jwt: jwtPayload,
          name: jwtPayload.name,
          user_guid: jwtPayload.user_guid,
          realmRole: jwtPayload.realm_role,
        })
      },
    ),
  )
})
//functions for serializing/deserializing users
passport.serializeUser((user, next) => next(null, user))
passport.deserializeUser((obj, next) => next(null, obj))

app.use(morgan(config.get('server:morganFormat'), { stream: logStream }))
//set up routing to auth and main API
app.use(/(\/api)?/, apiRouter)

apiRouter.use('/applications', applicationsRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/config', configRouter)
apiRouter.use('/documents', documentsRouter)
apiRouter.use('/facilities', facilitiesRouter)
apiRouter.use('/funding-agreements', fundingAgreementsRouter)
apiRouter.use('/health', healthCheckRouter)
apiRouter.use('/licences', licencesRouter)
apiRouter.use('/messages', messageRouter)
apiRouter.use('/notifications', notificationRouter)
apiRouter.use('/organizations', organizationsRouter)
apiRouter.use('/payments', paymentsRouter)
apiRouter.use('/reports', reportsRouter)
apiRouter.use('/user', userRouter)

//Handle 500 error
app.use((err, _req, res, next) => {
  //This is from the ResultValidation
  if (err.errors && err.mapped) {
    return res.status(400).json({
      errors: err.mapped(),
    })
  }
  log.error(err?.stack)
  res?.redirect(config?.get('server:frontend') + '/error?message=500_internal_error')
  next()
})

// Handle 404 error
app.use((_req, res) => {
  log.error('404 Error')
  res.redirect(config?.get('server:frontend') + '/error?message=404_Page_Not_Found')
})

// Prevent unhandled errors from crashing application
process.on('unhandledRejection', (err) => {
  log.error('Unhandled Rejection at:', err?.stack || err)
})
module.exports = app
