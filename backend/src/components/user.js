'use strict'
const { getSessionUser, getUserName, getBusinessName, getHttpHeader, minify, getUserGuid, isIdirUser, getOperation, postOperation, postBatches, patchOperationWithObjectId } = require('./utils')
const config = require('../config/index')
const ApiError = require('./error')
const axios = require('axios')
const HttpStatus = require('http-status-codes')
const { isEmpty } = require('lodash')

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
  RoleMappings,
} = require('../util/mapping/Mappings')

const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')

const { OFM_PROGRAM_CODES } = require('../util/constants')

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
  const queryUserName = req.params?.userName
  const currentUserName = getUserName(req)
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
    displayName: queryUserName ? `${currentUserName}-${queryUserName}` : currentUserName,
    userName: currentUserName,
    businessName: businessName,
    isMinistryUser: isIdir,
    serverTime: new Date(),
    unreadMessages: false,
  }
  let userResponse = undefined
  if (isIdir) {
    if (queryUserName) {
      try {
        log.info(`Ministry user [${currentUserName}] is impersonating with username: [${queryUserName}].`)
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
      // XXX Get info for ministry user from session header for now... until we get an endpiont for ministry
      // user from dynamics
      resData.userId = userGuid
      resData.firstName = req.session.passport.user._json.given_name
      resData.lastName = req.session.passport.user._json.family_name
      resData.email = req.session.passport.user._json.email
      log.verbose('Ministry User response:', resData)
      return res.status(HttpStatus.OK).json(resData)
    }
  } else {
    // This is a BCeID user
    try {
      log.verbose('BCEID User guid: ' + userGuid + ' username: ' + currentUserName)
      userResponse = await getUserProfile(userGuid, currentUserName)
    } catch (e) {
      log.error('getUserProfile Error', e.response ? e.response.status : e.message)
      return res.status(HttpStatus.UNAUTHORIZED).json(resData)
    }
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
    const response = await axios.get(url, getHttpHeader())
    const userProfile = response.data
    log.verbose('getUserProfile response:', userProfile)

    // If querying by userGuid and userName validate that the returned profile matches both the userGuid and userName
    // BCeID usernames can change but the guid won't so check for a mismatch to prevent unauthorized access
    // A mismatch could occur because an existing account (guid) gets a new username (username mismatch) or
    // because an existing username is given to a new guid (guid mismatch)
    if (userGuid && (userProfile.ccof_userid !== userGuid || userProfile.ccof_username?.toLowerCase() !== userName?.toLowerCase())) {
      return null
    }

    return userProfile
  } catch (e) {
    if (e.response?.status === 401) {
      return null
    }
    if (e.response?.status === 404) {
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
    .map((fp) => {
      return {
        ...new MappableObjectForFront(fp, UsersPermissionsFacilityMappings).data,
        ...new MappableObjectForFront(fp.facility, UserProfileFacilityMappings).data,
      }
    })
    .filter((fp) => fp.ofmPortalAccess && fp.programCode !== OFM_PROGRAM_CODES.CCOF)
    .sort((a, b) => a.facilityName?.localeCompare(b.facilityName))
}

function mapUsersPermissionsFacilitiesObjectForFront(data) {
  const usersPermissionsFacilities = new MappableObjectForFront(data, UserMappings).toJSON()

  if (usersPermissionsFacilities?.role) {
    const role = new MappableObjectForFront(usersPermissionsFacilities?.role, RoleMappings).toJSON()
    usersPermissionsFacilities.role = role
  }
  if (usersPermissionsFacilities?.facilities) {
    usersPermissionsFacilities.facilities = usersPermissionsFacilities.facilities.map((facility) => {
      const facilityData = new MappableObjectForFront(facility, UsersPermissionsFacilityMappings).toJSON()
      facilityData.accountNumber = facilityData.address?.accountnumber
      facilityData.city = facilityData.address?.address1_city
      facilityData.address = facilityData.address?.address1_line1
      return facilityData
    })

    return usersPermissionsFacilities
  }

  return {
    ...usersPermissionsFacilities,
    role: usersPermissionsFacilities.role ? Number(usersPermissionsFacilities.role) : usersPermissionsFacilities.role,
  }
}

async function getUsersPermissionsFacilities(req, res) {
  try {
    let usersPermissionsFacilities = []
    const operation = `contacts?$select=ccof_userid,ccof_username,contactid,emailaddress1,ofm_first_name,ofm_last_name,statecode,telephone1&$expand=ofm_facility_business_bceid($select=_ofm_bceid_value,ofm_bceid_facilityid,_ofm_facility_value,ofm_name,ofm_portal_access,ofm_is_expense_authority,statecode,statuscode;$expand=ofm_facility($select=address1_city,address1_line1,address1_line2,address1_line3);$filter=(ofm_portal_access eq true and statecode eq 0)),ofm_portal_role_id($select=ofm_portal_role_number,ofm_name)&$filter=(_parentcustomerid_value eq ${req.params.organizationId})`
    const response = await getOperation(operation)
    response?.value?.forEach((item) => {
      usersPermissionsFacilities.push(mapUsersPermissionsFacilitiesObjectForFront(item))
    })
    return res.status(HttpStatus.OK).json(usersPermissionsFacilities)
  } catch (e) {
    log.error(e)
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

async function getUserFacilities(req, res) {
  try {
    const userFacilities = []
    const operation = `ofm_bceid_facilities?$expand=ofm_facility($select=accountnumber,address1_composite,name,ofm_program)&$filter=(statecode eq 0 and _ofm_bceid_value eq ${req.params.contactId}) and (ofm_facility/statecode eq 0)`
    const response = await getOperation(operation)
    response?.value?.forEach((item) => userFacilities.push(mapUserFacilityObjectForFront(item)))
    return res.status(HttpStatus.OK).json(userFacilities)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

function mapUserObjectForBack(data) {
  let newUser = new MappableObjectForBack(data, UserMappings).toJSON()
  delete newUser.ofm_portal_role_id

  newUser['ofm_portal_role_id@odata.bind'] = `/ofm_portal_roles(${data?.role?.roleId})`
  newUser['parentcustomerid_account@odata.bind'] = `/accounts(${data?.organizationId})`
  return newUser
}

async function createUser(req, res) {
  try {
    const payload = mapUserObjectForBack(req.body)
    const response = await postOperation('contacts', payload)
    const returnVal = new MappableObjectForFront(response, UserMappings).toJSON()
    returnVal.role = { roleId: response._ofm_portal_role_id_value }
    return res.status(HttpStatus.OK).json(returnVal)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

function mapContactForBack(data) {
  const contact = new MappableObjectForBack(data, ContactMappings).toJSON()
  contact.entityNameSet = 'contacts'
  contact.actionMode = 'Update'

  // Handle role Update
  if (contact.role) {
    contact['ofm_portal_role_id@odata.bind'] = `/ofm_portal_roles(${contact.role.roleId})`
  }
  delete contact.role

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
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function userExists(req, res) {
  try {
    const operation = `contacts?$select=contactid&$filter=ccof_username eq '${req.params.userName}'`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json({ exists: !isEmpty(response.value) })
  } catch (e) {
    log.error('Error in getUserByBCeID:', e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateUserFacilityPermission(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, UsersPermissionsFacilityMappings).toJSON()
    delete payload['_ofm_facility_value@OData.Community.Display.V1.FormattedValue']
    delete payload['_ofm_facility_value']
    const response = await patchOperationWithObjectId('ofm_bceid_facilities', req.params.bceidFacilityId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  createUser,
  getUserFacilities,
  getUserInfo,
  getUserProfile,
  getUsersPermissionsFacilities,
  updateUser,
  updateUserFacilityPermission,
  userExists,
}
