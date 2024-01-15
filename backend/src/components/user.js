'use strict'
const { getSessionUser, getUserName, getBusinessName, getHttpHeader, minify, getUserGuid, isIdirUser, getOperation, postOperation, postBatches } = require('./utils')
const config = require('../config/index')
const ApiError = require('./error')
const axios = require('axios')
const HttpStatus = require('http-status-codes')
const log = require('../components/logger')

const {
  UsersPermissionsFacilityMappings,
  UserFacilityMappings,
  UserFacilityDetailMappings,
  UserMappings,
  UserProfileFacilityMappings,
  UserProfileMappings,
  UserProfileOrganizationMappings,
  ContactMappings,
} = require('../util/mapping/Mappings')

const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
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
  // Sanitize email to prevent SQL injection
  email = email.replace(/'/g, "''")
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

function mapUsersPermissionsFacilitiesObjectForFront(data) {
  const usersPermissionsFacilities = new MappableObjectForFront(data, UserMappings).toJSON()
  if (usersPermissionsFacilities?.facilities) {
    usersPermissionsFacilities.facilities = usersPermissionsFacilities.facilities.map((facility) => {
      let facilityData = new MappableObjectForFront(facility, UsersPermissionsFacilityMappings).toJSON()
      facilityData.accountNumber = facilityData.address.accountnumber
      facilityData.city = facilityData.address.address1_city
      facilityData.address = facilityData.address.address1_line1
      return facilityData
    })
  }
  return {
    ...usersPermissionsFacilities,
    role: usersPermissionsFacilities.role ? Number(usersPermissionsFacilities.role) : usersPermissionsFacilities.role,
  }
}

async function getUsersPermissionsFacilities(req, res) {
  try {
    let usersPermissionsFacilities = []
    const operation = `contacts?$select=ccof_userid,ccof_username,contactid,emailaddress1,ofm_first_name,ofm_is_expense_authority,ofm_is_primary_contact,ofm_last_name,ofm_portal_role,statecode,telephone1&$expand=ofm_facility_business_bceid($select=_ofm_bceid_value,ofm_bceid_facilityid,_ofm_facility_value,ofm_name,ofm_portal_access,statecode,statuscode;$expand=ofm_facility($select=address1_city,address1_line1,address1_line2,address1_line3);$filter=(ofm_portal_access eq true and statecode eq 0))&$filter=(_parentcustomerid_value eq ${req.params.organizationId})`
    const response = await getOperation(operation)
    response?.value?.forEach((item) => {
      usersPermissionsFacilities.push(mapUsersPermissionsFacilitiesObjectForFront(item))
    })
    return res.status(HttpStatus.OK).json(usersPermissionsFacilities)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

function mapUserFacilityObjectForFront(data) {
  let userFacilities = new MappableObjectForFront(data, UserFacilityMappings).toJSON()
  delete userFacilities.ofmFacility
  const userFacilityDetails = new MappableObjectForFront(data.ofm_facility, UserFacilityDetailMappings).toJSON()
  userFacilities = { ...userFacilities, ...userFacilityDetails }
  return userFacilities
}

async function getUserFacilities(req, res, onlyWithPortalAccess) {
  try {
    let userFacilities = []
    let operation = `ofm_bceid_facilities?$expand=ofm_facility($select=accountnumber,address1_composite,name)&$filter=(statecode eq 0 and _ofm_bceid_value eq ${req.params.contactId}) and (ofm_facility/statecode eq 0)`
    if (onlyWithPortalAccess) {
      operation = operation + ` and (ofm_portal_access eq true)`
    }
    const response = await getOperation(operation)
    response?.value?.forEach((item) => userFacilities.push(mapUserFacilityObjectForFront(item)))
    return res.status(HttpStatus.OK).json(userFacilities)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

function mapUserObjectForBack(data) {
  let newUser = new MappableObjectForBack(data, UserMappings).toJSON()
  newUser.ofm_portal_role = String(newUser.ofm_portal_role)
  newUser['parentcustomerid_account@odata.bind'] = `/accounts(${data?.organizationId})`
  return newUser
}

async function createUser(req, res) {
  try {
    const payload = mapUserObjectForBack(req.body)
    const response = await postOperation('contacts', payload)
    const returnVal = new MappableObjectForFront(response, UserMappings).toJSON()
    returnVal.role = Number(returnVal.role)
    return res.status(HttpStatus.OK).json(returnVal)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

function mapContactForBack(data) {
  const contact = new MappableObjectForBack(data, ContactMappings).toJSON()
  contact.entityNameSet = 'contacts'
  contact.actionMode = 'Update'
  return contact
}

function mapContactFacilitiesForBack(data) {
  const facilitiesForBack = []
  data.facilities.forEach((facilityFromFront) => {
    let facility = {}
    facility.entityID = facilityFromFront.bceidFacilityId
    facility.ofm_portal_access = facilityFromFront.ofmPortalAccess
    facility.entityNameSet = 'ofm_bceid_facilities'
    facility.actionMode = 'Update'
    facilitiesForBack.push(facility)
  })
  return facilitiesForBack
}

async function updateUser(req, res) {
  try {
    const payload = {
      batchTypeId: 101,
      feature: 'AccountManagement',
      function: 'UserEdit',
      actionMode: 'Update',
      scope: 'Parent-Child',
      data: {
        contact: {},
        ofm_bceid_facility: [],
      },
    }
    payload.data.contact = mapContactForBack(req.body)
    payload.data.ofm_bceid_facility = mapContactFacilitiesForBack(req.body)
    const response = await postBatches(payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getUserByBCeID(req, res) {
  try {
    const operation = `contacts?$select=contactid,ccof_username,ofm_first_name,ofm_last_name,emailaddress1&$filter=ccof_username eq '${req.params.queryUserName}'`
    const response = await getOperation(operation)
    const user = response.value.map((item) => new MappableObjectForFront(item, UserProfileMappings).toJSON())
    return res.status(HttpStatus.OK).json(user)
  } catch (e) {
    log.info('Error in getOrganizationUsers:', e)
    const errorResponse = e.data ? e.data : e?.status ? e.status : 'Unknown error'
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: errorResponse })
  }
}

module.exports = {
  createUser,
  getUserByBCeID,
  getUserFacilities,
  getUserInfo,
  getUsersPermissionsFacilities,
  updateUser,
}
