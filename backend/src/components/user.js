'use strict'
const { getSessionUser, getUserName, getHttpHeader, minify, getUserGuid, isIdirUser } = require('./utils')
const config = require('../config/index')
const ApiError = require('./error')
const axios = require('axios')
const HttpStatus = require('http-status-codes')
const log = require('../components/logger')
// TODO... const { ORGANIZATION_PROVIDER_TYPES} = require('../util/constants')
const { UserProfileMappings, UserProfileOrganizationMappings, UserProfileFacilityPermissionMappings, UserProfileFacilityMappings } = require('../util/mapping/Mappings')

const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const _ = require('lodash')

async function getUserInfo(req, res) {
  const userInfo = getSessionUser(req)
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data',
    })
  }
  const isIdir = isIdirUser(req)
  const queryUserName = req.params?.queryUserName
  const userName = getUserName(req)

  // if is idir user (ministry user), make sure they are a user in dynamics
  // TODO commented out until we focus on IDIR login and weather this code is relevant
  if (isIdir) {
    let response = await getDynamicsUserByEmail(req)
    if (response.value?.length > 0 && response.value[0].systemuserid) {
      log.verbose(`Ministry user: [${req.session.passport.user._json.display_name}] logged in.`)
    } else {
      log.info(`Ministry user: [${req.session.passport.user._json.display_name}] attempted to log in but is not part of Dynamics.`)
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Not Authorized',
      })
    }
  }
  let resData = {
    // TODO i thing this has to do with impersonate... displayName: (queryUserName)? userName + '-' + queryUserName : userName,
    userName: userName,
    isMinistryUser: isIdir,
    serverTime: new Date(),
    //TODO: unreadMessages is hardcoded. Remove this with API values when built out!
    unreadMessages: false,
  }
  let userResponse = undefined
  if (isIdir) {
    if (queryUserName) {
      try {
        log.info(`Ministry user [${userName}] is impersonating with username: [${queryUserName}].`)
        // dynamics api requires a userID. if userID not found then it wil use the query name
        // put a random userID so that we only search by queryname
        userResponse = await getUserProfile(null, queryUserName)
        if (userResponse === null) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: 'No user found with that BCeID UserName' })
        }
      } catch (e) {
        log.error('getUserProfile Error', e.response ? e.response.status : e.message)
        throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Get error' }, e)
      }
    } else {
      //If not looking for a username, return from here since ministry staff should not have an account
      return res.status(HttpStatus.OK).json(resData)
    }
  } else {
    //Not an idir user, so just get the guid from the header
    const userGuid = getUserGuid(req)
    log.verbose('User Guid is: ', userGuid)
    userResponse = await getUserProfile(userGuid)
  }

  if (log.isVerboseEnabled) {
    log.verbose('getUserProfile response:', minify(userResponse))
  }

  if (userResponse === null) {
    // If no data back, then no associated User Roles/Organization/Facilities/
    return res.status(HttpStatus.UNAUTHORIZED).json(resData)
  }

  let user = new MappableObjectForFront(userResponse, UserProfileMappings).data
  let organization = new MappableObjectForFront(userResponse.organization, UserProfileOrganizationMappings).data
  resData.facilityPermission = parseFacilityPermissions(userResponse)

  let results = {
    ...resData,
    ...user,
    ...organization,
  }
  log.verbose('getUserInfo response:', results)
  return res.status(HttpStatus.OK).json(results)
}

async function getUserProfile(userGuid) {
  try {
    let url = undefined
    if (userGuid) {
      url = config.get('dynamicsApi:apiEndpoint') + `/api/ProviderProfile?userId=${userGuid}`
    }
    log.verbose('UserProfile Url is', url)
    let response = undefined
    response = await axios.get(url, getHttpHeader())
    log.verbose('getUserProfile response:', response.data)
    return response.data
  } catch (e) {
    if (e.response?.status == '404') {
      log.verbose('response ', e.response.data)
      if (e.response?.data?.startsWith('User not found')) {
        return null
      }
      return {}
    }
    log.error('getUserProfile Error', e.response ? e.response.status : e.message)
    throw e
  }
}

function parseFacilityPermissions(userResponse) {
  const facilityList = Object.entries(userResponse.facility_permission)
    .map(([key, value]) => {
      // Only add facilities that have portal access
      if (value.ofm_portal_access === true) {
        const facilityPermission = new MappableObjectForFront(value, UserProfileFacilityPermissionMappings).data
        const facility = new MappableObjectForFront(value.facility, UserProfileFacilityMappings).data
        const combinedData = { ...facilityPermission, ...facility }
        if (!_.isEmpty(combinedData)) {
          return combinedData
        }
      }
      return null
    })
    .filter((facility) => facility !== null)
  return facilityList
}

module.exports = {
  getUserInfo,
}
