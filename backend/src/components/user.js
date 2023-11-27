'use strict'
const { getSessionUser, getUserName, getBusinessName, getHttpHeader, minify, getUserGuid, isIdirUser, getOperation } = require('./utils')
const config = require('../config/index')
const ApiError = require('./error')
const axios = require('axios')
const HttpStatus = require('http-status-codes')
const log = require('../components/logger')
// TODO... const { ORGANIZATION_PROVIDER_TYPES} = require('../util/constants')
const { UserProfileMappings, UserProfileOrganizationMappings, UserProfileFacilityPermissionMappings, UserProfileFacilityMappings } = require('../util/mapping/Mappings')

const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const _ = require('lodash')

const USER_NOT_FOUND = 'User not found.'
const NO_PERMISSIONS = 'No permissions.'
const NO_PROFILE_FOUND = 'No profile found.'

async function getUserInfo(req, res) {
  const userInfo = getSessionUser(req)
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data',
    })
  }
  const userGuid = getUserGuid(req)
  const isIdir = isIdirUser(req)
  const queryUserName = req.params?.queryUserName
  const userName = getUserName(req)
  const businessName = getBusinessName(req)

  // if is idir user (ministry user), make sure they are a user in dynamics
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
    displayName: queryUserName ? userName + '-' + queryUserName : userName,
    userName: userName,
    businessName: businessName,
    isMinistryUser: isIdir,
    serverTime: new Date(),
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
        userResponse.isImpersonated = true
      } catch (e) {
        log.error('getUserProfile Error', e.response ? e.response.status : e.message)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(resData)
      }
    } else {
      // TODO: Get info for ministry user from session header for now... until we get an endpiont for ministry
      // user from dynamics
      resData.userId = userGuid
      resData.firstName = req.session.passport.user._json.given_name
      resData.lastName = req.session.passport.user._json.family_name
      resData.email = req.session.passport.user._json.email
      log.verbose('Ministry User response:', resData)
      return res.status(HttpStatus.OK).json(resData)
    }
  } else {
    // This is a BCeID user: if the userGuid cannot be found in dyanmics, then dyanmics will check if the userName exists,
    // if userName exists but has a null userGuid, the system will update the user record with the GUID and return that user profile.
    log.verbose('BCEID User guid: ' + userGuid + ' username: ' + userName)
    userResponse = await getUserProfile(userGuid, userName)
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
  resData.facilities = parseFacilityPermissions(userResponse)

  let results = {
    ...resData,
    ...user,
    ...organization,
  }
  log.verbose('getUserInfo response:', results)
  return res.status(HttpStatus.OK).json(results)
}

async function getDynamicsUserByEmail(req) {
  let email = req.session.passport.user._json.email
  if (!email) {
    //If for some reason, an email is not associated with the IDIR, just use IDR@gov.bc.ca
    email = `${req.session.passport.user._json.idir_username}@gov.bc.ca`
  }
  // eslint-disable-next-line quotes,
  email.includes("'") ? (email = email.replace("'", "''")) : email
  try {
    let response = await getOperation(`systemusers?$select=firstname,domainname,lastname&$filter=internalemailaddress eq '${email}'`)
    return response
  } catch (e) {
    log.error('getDynamicsUserByEmail Error', e.response ? e.response.status : e.message)
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Get error' }, e)
  }
}

async function getUserProfile(userGuid, userName) {
  try {
    let url = undefined

    if (userGuid) {
      url = config.get('dynamicsApi:apiEndpoint') + `/api/ProviderProfile?userId=${userGuid}&userName=${userName}`
    } else {
      url = config.get('dynamicsApi:apiEndpoint') + `/api/ProviderProfile?userName=${userName}`
    }

    log.verbose('UserProfile Url is', url)
    let response = undefined
    response = await axios.get(url, getHttpHeader())
    log.verbose('getUserProfile response:', response.data)
    return response.data
  } catch (e) {
    if (e.response?.status == '404') {
      const data = e.response?.data
      log.verbose('response ', data)
      if (data?.startsWith(USER_NOT_FOUND) || data?.startsWith(NO_PERMISSIONS) || data?.startsWith(NO_PROFILE_FOUND)) {
        return null
      }
      return {}
    }
    log.error('getUserProfile Error', e.response ? e.response.status : e.message)
    throw e
  }
}

function parseFacilityPermissions(userResponse) {
  return userResponse.facility_permission
    .filter((fp) => fp.ofm_portal_access)
    .map((fp) => new MappableObjectForFront(fp.facility, UserProfileFacilityMappings).data)
    .sort((a, b) => a.facilityName.localeCompare(b.facilityName))
}

async function getUsersFacilitiesByOrganizationId(organizationId, response) {
  let users = [
    {
      id: 1,
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jdoe@email.com',
      bceidusername: 'jdoe',
      userrole: 'Account Manager',
      expenseAuthority: true,
      status: 'Active',
      facilities: [
        { name: 'Facilty 1', address: '123 Fitness St', city: 'Healthville' },
        { name: 'Facility 2', address: '456 Swim Ln', city: 'Aquatown' },
      ],
    },
    {
      id: 2,
      firstname: 'John',
      lastname: 'Grant',
      email: 'jgrant@email.com',
      bceidusername: 'jgrant',
      userrole: 'Reporter',
      expenseAuthority: false,
      status: 'Active',
      facilities: [{ name: 'Facility 3', address: '789 Book Rd', city: 'Readville' }],
    },
    {
      id: 3,
      firstname: 'Jack',
      lastname: 'Smith',
      email: 'jsmith@email.com',
      bceidusername: 'jsmith',
      userrole: 'Financial',
      expenseAuthority: false,
      status: 'Active',
      facilities: [
        { name: 'Facilty 4', address: '123 Fitness St', city: 'Healthville' },
        { name: 'Facilty 5', address: '789 Book Rd', city: 'Readville' },
        { name: 'Facilty 6', address: '101 Food Ave', city: 'Tastytown' },
      ],
    },
    {
      id: 4,
      firstname: 'Jill',
      lastname: 'Lewis',
      email: 'jlewis@email.com',
      bceidusername: 'jlewis',
      userrole: 'Reporter',
      expenseAuthority: false,
      status: 'Active',
      facilities: [
        { name: 'Facilty 1', address: '123 Fitness St', city: 'Healthville' },
        { name: 'Facility 2', address: '456 Swim Ln', city: 'Aquatown' },
        { name: 'Facility 3', address: '789 Book Rd', city: 'Readville' },
        { name: 'Facility 4', address: '101 Food Ave', city: 'Tastytown' },
      ],
    },
  ]

  return response.status(HttpStatus.OK).json(users)
}

module.exports = {
  getUserInfo,
  getUsersFacilitiesByOrganizationId,
}
