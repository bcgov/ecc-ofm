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
const utils = require('./components/utils')
const auth = require('./components/auth')
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
const messageRouter = require('./routes/message')
const notificationRouter = require('./routes/notification')
const applicationsRouter = require('./routes/applications')
const organizationsRouter = require('./routes/organizations')
const fundingAgreementsRouter = require('./routes/fundingAgreements')
const facilitiesRouter = require('./routes/facilities')
const licencesRouter = require('./routes/licences')
const reportsRouter = require('./routes/reports')

const connectRedis = require('connect-redis')
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

const dbSession = getRedisDbSession()
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

app.use(require('./routes/health-check').router)
//initialize routing and session. Cookies are now only reachable via requests (not js)
app.use(passport.initialize())
app.use(passport.session())

function getRedisDbSession() {
  if (config.get('redis:use') == 'true') {
    const Redis = require('./util/redis/redis-client')
    Redis.init() // call the init to initialize appropriate client, and reuse it across the app.
    const RedisStore = connectRedis(session)
    const dbSession = new RedisStore({
      client: Redis.getRedisClient(),
      prefix: 'ccof-sess:',
    })
    return dbSession
  }
  return undefined
}

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
      (_issuer, profile, _context, _idToken, accessToken, refreshToken, done) => {
        if (typeof accessToken === 'undefined' || accessToken === null || typeof refreshToken === 'undefined' || refreshToken === null) {
          return done('No access token', null)
        }

        //set access and refresh tokens
        profile.jwtFrontend = auth.generateUiToken()
        profile.jwt = accessToken
        profile._json = parseJwt(accessToken)
        profile.refreshToken = refreshToken
        return done(null, profile)
      },
    ),
  )
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
  //OIDC Strategy is used for authorization
  addLoginPassportUse(discovery, 'oidcIdir', config.get('server:frontend') + '/api/auth/callback_idir', 'keycloak_bcdevexchange_idir', 'oidc:clientIdIDIR', 'oidc:clientSecretIDIR')
  addLoginPassportUse(discovery, 'oidcBceid', config.get('server:frontend') + '/api/auth/callback', 'keycloak_bcdevexchange_bceid', 'oidc:clientId', 'oidc:clientSecret')

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

apiRouter.use('/auth', authRouter)
apiRouter.use('/user', userRouter)
apiRouter.use('/config', configRouter)
apiRouter.use('/documents', documentsRouter)
apiRouter.use('/messages', messageRouter)
apiRouter.use('/notifications', notificationRouter)
apiRouter.use('/applications', applicationsRouter)
apiRouter.use('/organizations', organizationsRouter)
apiRouter.use('/facilities', facilitiesRouter)
apiRouter.use('/funding-agreements', fundingAgreementsRouter)
apiRouter.use('/licences', licencesRouter)
apiRouter.use('/reports', reportsRouter)

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
