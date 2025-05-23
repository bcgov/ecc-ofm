'use strict'

const axios = require('axios')
const config = require('../config/index')
const log = require('./logger')
const HttpStatus = require('http-status-codes')
const lodash = require('lodash')
const { ApiError } = require('./error')
const jsonwebtoken = require('jsonwebtoken')
const { LocalDateTime, DateTimeFormatter } = require('@js-joda/core')
const { Locale } = require('@js-joda/locale_en')
let discovery = null

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getConstKey(constants, value) {
  if (value) {
    for (let key in constants) {
      if (constants[key] === value) {
        return key
      }
    }
    log.error(`getConstKey: Unable to find key for value: [${value}] for const: [${constants?.constructor?.name}]`)
  }
  return undefined
}

function getLabelFromValue(value, constants, defaultValue) {
  if (!value && defaultValue) {
    return defaultValue
  }
  if (value) {
    let retVal = getConstKey(constants, value)
    if (retVal) {
      return retVal
    } else {
      return `UNKNOWN - [${value}]`
    }
  }
  return value
}

axios.interceptors.request.use((axiosRequestConfig) => {
  axiosRequestConfig.headers['X-Client-Name'] = 'ECC-OFM'
  return axiosRequestConfig
})
// Returns OIDC Discovery values
async function getOidcDiscovery() {
  if (!discovery) {
    try {
      const response = await axios.get(config.get('oidc:discovery'))
      discovery = response.data
    } catch (error) {
      log.error('getOidcDiscovery', `OIDC Discovery failed - ${error.message}`)
    }
  }
  return discovery
}

function minify(obj, keys = ['documentData']) {
  return lodash.transform(obj, (result, value, key) => (result[key] = keys.includes(key) && lodash.isString(value) ? value.substring(0, 1) + ' ...' : value))
}

function getSessionUser(req) {
  log.verbose('getSessionUser', req.session)
  const session = req.session
  return session && session.passport && session.passport.user
}

function getUserGuid(req) {
  const userInfo = req.session?.passport?.user
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, { message: 'API Get error' })
  }
  return splitUsername(userInfo._json.preferred_username).guid
}

/**
 * Splits the username into it's component parts.
 * Format is username@idp e.g. 6bf387bb6dd6481997f70c42dd103f83@bceidbusiness
 * @param {*} username
 * @returns
 */
function splitUsername(username) {
  const usernameArray = username.split('@')
  return { guid: usernameArray[0].toUpperCase(), idp: usernameArray[1] }
}

function isIdirUser(req) {
  const userInfo = req.session?.passport?.user
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, { message: 'API Get error' })
  }
  return !!req.session?.passport?.user?._json?.idir_username
}

function getUserName(req) {
  let userName = req.session?.passport?.user?._json?.bceid_username
  if (!userName) {
    userName = req.session?.passport?.user?._json?.idir_username
  }
  return userName
}

function getBusinessName(req) {
  // XXX This isn't available in the childcare-applications realm but also isn't currently used in the frontend
  let businessName = req.session?.passport?.user?._json?.bceid_business_name
  return businessName
}

function getAccessToken(req) {
  const user = getSessionUser(req)
  return user && user.jwt
}

function logResponse(methodName, response) {
  if (log.isVerboseEnabled) {
    log.verbose(`Status for ${methodName} :: is :: `, response.status)
    log.verbose(`StatusText for ${methodName}  :: is :: `, response.statusText)
    log.verbose(`Response for ${methodName}  :: is :: `, minify(response.data))
  }
}

async function deleteOperationWithObjectId(operation, objectId) {
  const operationWithObject = `${operation}(${objectId})`
  //log.info('del OPERATION:' , operationWithObject);
  return await deleteOperation(operationWithObject)
}

async function deleteOperation(operation) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operation
    log.info('delete Data Url', url)
    const response = await axios.delete(url, getHttpHeader())
    return response.data
  } catch (e) {
    log.error('deleteOperation Error', e.response ? e.response.status : e.message)
    log.info(e)
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Get error' }, e)
  }
}

async function getOperation(operation) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operation
    log.verbose('get Data Url', url)
    const response = await axios.get(url, getHttpHeader())
    logResponse('getOperation', response)
    return response.data
  } catch (e) {
    log.error('getOperation Error', e.response ? e.response.status : e.message)
    handleDynamicsError(e, 'API Get error')
  }
}

async function getOperationWithObjectId(operation, objectId) {
  const operationWithObject = `${operation}(${objectId})`
  return await getOperation(operationWithObject)
}

async function postOperation(operation, payload) {
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operation
  log.info('postOperation Url', url)

  if (log.isInfoEnabled) {
    log.verbose(`postOperation post data for ${url}  :: is :: `, minify(payload))
  }
  try {
    const response = await axios.post(url, payload, getHttpHeader())
    if (log.isVerboseEnabled) {
      log.verbose('Status for postOperation :: is :: ', response.status)
      log.verbose('StatusText for postOperation  :: is :: ', response.statusText)
      log.verbose('Response for postOperation  :: is :: ', response.data)
    }
    return response.data
  } catch (e) {
    log.error('postOperation Error', e.response ? e.response.status : e.message)
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Post error' }, e)
  }
}

async function patchOperationWithObjectId(operation, objectId, payload) {
  const operationWithObject = `${operation}(${objectId})`
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operationWithObject
  log.info('patchOperationWithObjectId Url', url)

  if (log.isInfoEnabled) {
    log.verbose(`patchOperationWithObjectId post data for ${url}  :: is :: `, minify(payload))
  }
  try {
    const response = await axios.patch(url, payload, getHttpHeader())
    logResponse('patchOperationWithObjectId', response)
    return response.data
  } catch (e) {
    log.error(e)
    log.error('patchOperationWithObjectId Error', e.response ? e.response.status : e.message)
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Patch error' }, e)
  }
}

async function postDocuments(payload, headers) {
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/documents'
  log.info('postDocuments Url', url)

  try {
    const response = await axios.post(url, payload, { headers: headers })
    logResponse('postDocuments', response)
    return response.data
  } catch (e) {
    log.error('postDocuments Error', e.response ? e.response.status : e.message)
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Post error' }, e)
  }
}

function getHttpHeader() {
  return {
    headers: {
      Accept: 'text/plain',
      'Content-Type': 'application/json',
      [config.get('dynamicsApi:apiKeyHeader')]: config.get('dynamicsApi:apiKeyValue'),
    },
  }
}

function generateJWTToken(jwtid, subject, issuer, algorithm, payload) {
  const tokenTTL = config.get('email:tokenTTL') // this should be in minutes
  const jwtSecretKey = config.get('email:secretKey')
  let sign_options_schema = {
    expiresIn: tokenTTL * 60,
    algorithm: algorithm,
    issuer: issuer,
    jwtid: jwtid,
    subject: subject,
  }

  return jsonwebtoken.sign(payload, jwtSecretKey, sign_options_schema)
}

function formatCommentTimestamp(time) {
  const timestamp = LocalDateTime.parse(time)
  return timestamp.format(DateTimeFormatter.ofPattern('yyyy-MM-dd h:mma').withLocale(Locale.CANADA))
}

function errorResponse(res, msg, code) {
  return res.status(code || HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: msg || 'INTERNAL SERVER ERROR',
    code: code || HttpStatus.INTERNAL_SERVER_ERROR,
  })
}

async function postBatches(payload) {
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/batches'
  log.info('postBatches Url', url)

  if (log.isInfoEnabled) {
    log.verbose(`postBatches post data for ${url}  :: is :: `, minify(payload))
  }
  try {
    const response = await axios.post(url, payload, getHttpHeader())
    if (log.isVerboseEnabled) {
      log.verbose('Status for postBatches :: is :: ', response.status)
      log.verbose('StatusText for postBatches  :: is :: ', response.statusText)
      log.verbose('Response for postBatches  :: is :: ', response.data)
    }
    return response.data
  } catch (e) {
    log.error('postBatches Error', e.response ? e.response.status : e.message)
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Post error' }, e)
  }
}

function handleDynamicsError(e, message) {
  let status
  if (e.response?.status.toString().startsWith('4')) {
    // Send 400 errors back to the client
    status = e.response?.status
  } else {
    // Default to 500
    status = HttpStatus.INTERNAL_SERVER_ERROR
  }
  throw new ApiError(status, { message }, e)
}

function handleError(res, e) {
  log.error(e)
  return res.status(e?.status ?? HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
}

function formatDateTimeForBack(date) {
  //NOTE: date MUST be a string value. Do not try with a Date obj!
  //Some date fields in Dynamics are actaully date/time fields. Set default time to noon PST, so associated time will always be
  // 7/8 PM UTC. This time is totally arbitrary, but done to avoid time conversion issues between Portal and Dynamics.
  return `${date}T12:00:00-07:00`
}

const utils = {
  getOidcDiscovery,
  prettyStringify: (obj, indent = 2) => JSON.stringify(obj, null, indent),
  getSessionUser,
  getAccessToken,
  getUserGuid,
  isIdirUser,
  getUserName,
  getBusinessName,
  getOperationWithObjectId,
  getOperation,
  postOperation,
  postBatches,
  patchOperationWithObjectId,
  generateJWTToken,
  formatCommentTimestamp,
  errorResponse,
  minify,
  getHttpHeader,
  getConstKey,
  getLabelFromValue,
  deleteOperationWithObjectId,
  deleteOperation,
  sleep,
  postDocuments,
  splitUsername,
  handleError,
  formatDateTimeForBack,
}

module.exports = utils
