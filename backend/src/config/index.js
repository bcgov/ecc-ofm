'use strict'
const nconf = require('nconf')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config()

const env = process.env.NODE_ENV || 'local'

nconf
  .argv()
  .env()
  .file({ file: path.join(__dirname, `${env}.json`) })

//injects environment variables into the json file
nconf.overrides({
  environment: env,

  server: {
    logLevel: process.env.LOG_LEVEL,
    morganFormat: 'dev',
    port: 8080,
  },
})

nconf.defaults({
  environment: env,
  logoutEndpoint: process.env.SOAM_URL,
  siteMinder_logout_endpoint: process.env.SITEMINDER_LOGOUT_ENDPOINT,
  server: {
    frontend: process.env.SERVER_FRONTEND,
    logLevel: process.env.LOG_LEVEL,
    morganFormat: 'dev',
    port: process.env.SERVER_PORT,
  },
  oidc: {
    discovery: process.env.SOAM_DISCOVERY,
    publicKey: process.env.SOAM_PUBLIC_KEY,
    clientId: process.env.SOAM_CLIENT_ID,
    clientSecret: process.env.SOAM_CLIENT_SECRET,
    idpHintBceid: process.env.SOAM_IDP_HINT_BCEID,
    idpHintIdir: process.env.SOAM_IDP_HINT_IDIR,
  },
  secureExchange: {
    apiEndpoint: process.env.CCOF_API_ENDPOINT,
  },
  tokenGenerate: {
    privateKey: process.env.UI_PRIVATE_KEY,
    publicKey: process.env.UI_PUBLIC_KEY,
    audience: process.env.SERVER_FRONTEND,
    issuer: process.env.ISSUER,
  },
  dynamicsApi: {
    apiEndpoint: process.env.D365_API_ENDPOINT,
    apiKeyHeader: process.env.D365_API_KEY_HEADER,
    apiKeyValue: process.env.D365_API_KEY_VALUE,
  },
  messaging: {
    natsUrl: process.env.NATS_URL,
    natsCluster: process.env.NATS_CLUSTER,
  },
  redis: {
    use: process.env.REDIS_ENABLE,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    clustered: process.env.REDIS_USE_CLUSTERED
  },
  clamav: {
    host: process.env.CLAMAV_HOST,
    port: process.env.CLAMAV_PORT,
  },
})
module.exports = nconf
