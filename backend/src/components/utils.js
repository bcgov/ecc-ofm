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
  let guid = req.session?.passport?.user?._json?.bceid_user_guid
  if (!guid) {
    guid = req.session?.passport?.user?._json?.idir_user_guid
  }
  return guid
}

function isIdirUser(req) {
  const userInfo = req.session?.passport?.user
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, { message: 'API Get error' })
  }
  let isIdir = req.session?.passport?.user?._json?.idir_user_guid ? true : false

  //For local development only.
  //generally set isIdirUser to false, so that developers can log in using their
  //IDIRS as a normal, non-ministry user.
  /*   if ('local' === config.get('environment') && !config.get('server:useImpersonate')) {
    return false
  } */
  return isIdir
}

function getUserName(req) {
  let userName = req.session?.passport?.user?._json?.bceid_username
  if (!userName) {
    userName = req.session?.passport?.user?._json?.idir_username
  }
  return userName
}

function getBusinessName(req) {
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
    log.info('get Data Url', url)
    const response = await axios.get(url, getHttpHeader())
    //logResponse('getOperation', response);
    return response.data
  } catch (e) {
    log.info(e)
    log.error('getOperation Error', e.response ? e.response.status : e.message)
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Get error' }, e)
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

async function postDocuments(payload) {
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/documents'
  log.info('postDocuments Url', url)
  try {
    const response = await axios.post(url, payload, getHttpHeaderFormData())
    logResponse('postDocuments', response.data)
    return response.data
  } catch (e) {
    log.error('postDocuments Error', e)
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

function getHttpHeaderFormData() {
  return {
    headers: {
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
}

module.exports = utils
