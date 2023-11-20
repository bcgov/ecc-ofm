const UserProfileMappings = [
  { back: 'contactid', front: 'contactId' },
  { back: 'ccof_userid', front: 'userId' },
  { back: 'ccof_username', front: 'userName' },
  { back: 'emailaddress1', front: 'email' },
  { back: 'ofm_first_name', front: 'firstName' },
  { back: 'ofm_last_name', front: 'lastName' },
  { back: 'ofm_portal_role', front: 'roles' },
  { back: 'telephone1', front: 'phone' },
]

const UserProfileOrganizationMappings = [
  { back: 'accountid', front: 'organizationId' },
  { back: 'accountnumber', front: 'organizationAccountNumber' },
  { back: 'ccof_accounttype', front: 'organizationAccountType' },
  { back: 'name', front: 'organizationName' },
  { back: 'statecode', front: 'organizationStateCode' },
  { back: 'statuscode', front: 'organizationStatus' },
]

// TODO (weskubo-cgi) Remove this
const UserProfileFacilityPermissionMappings = [
  { back: 'statecode', front: 'stateCode' },
  { back: 'statuscode', front: 'statusCode' },
]

const UserProfileFacilityMappings = [
  { back: 'accountid', front: 'facilityId' },
  { back: 'accountnumber', front: 'facilityAccountNumber' },
  { back: 'name', front: 'facilityName' },
  { back: 'ccof_accounttype', front: 'facilityType' },
  { back: 'statecode', front: 'facilityStateCode' },
  { back: 'statuscode', front: 'facilityStatusCode' },
]

const RequestCategoryMappings = [
  { back: 'ofm_name', front: 'categoryName' },
  { back: 'ofm_request_categoryid', front: 'categoryId' },
]

const AssistanceRequestMappings = [
  { back: 'ofm_assistance_requestid', front: 'assistanceRequestId' },
  { back: 'ofm_subject', front: 'subject' },
  { back: 'ofm_contact_method', front: 'contactMethod' },
  { back: 'ofm_request_description', front: 'description' },
  { back: 'ofm_telephone', front: 'phone' },
  { back: 'ofm_name', front: 'referenceNumber' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'statecode', front: 'stateCode' },
  { back: '_ofm_request_category_value@OData.Community.Display.V1.FormattedValue', front: 'categoryName' },
  { back: 'modifiedon', front: 'lastUpdatedTime' },
  { back: 'ofm_is_read', front: 'isRead' },
]

const AssistanceRequestFacilityMappings = [
  { back: '_ofm_facility_value', front: 'facilityId' },
  { back: '_ofm_facility_value@OData.Community.Display.V1.FormattedValue', front: 'facilityName' },
]

const NotificationMappings = [
  { back: 'activityid', front: 'notificationId' },
  { back: 'subject', front: 'subject' },
  { back: 'createdon', front: 'dateReceived' },
  { back: 'description', front: 'notificationContent' },
  { back: 'lastopenedtime', front: 'lastOpenedTime' },
  { back: 'ofm_is_read', front: 'isRead' },
]

module.exports = {
  NotificationMappings,
  UserProfileMappings,
  UserProfileOrganizationMappings,
  UserProfileFacilityPermissionMappings,
  UserProfileFacilityMappings,
  RequestCategoryMappings,
  AssistanceRequestMappings,
  AssistanceRequestFacilityMappings,
}
