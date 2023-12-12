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

const AssistanceRequestConversationMappings = [
  { back: 'ofm_conversationid', front: 'conversationId' },
  { back: 'ofm_name', front: 'subject' },
  { back: '_ownerid_value', front: 'from' },
  { back: 'createdon', front: 'sentDate' },
  { back: 'ofm_message', front: 'message' },
  { back: 'ofm_source_system', front: 'ofmSourceSystem' },
  { back: '_ofm_request_value', front: 'requestValue' },
  { back: 'statuscode', front: 'statusCode' },
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

const UserMappings = [
  { back: 'contactid', front: 'contactId' },
  { back: 'ofm_first_name', front: 'firstName' },
  { back: 'ofm_last_name', front: 'lastName' },
  { back: 'emailaddress1', front: 'email' },
  { back: 'telephone1', front: 'phone' },
  { back: 'ccof_username', front: 'userName' },
  { back: 'ofm_portal_role', front: 'role' },
  { back: 'ofm_is_expense_authority', front: 'isExpenseAuthority' },
  { back: 'statecode', front: 'stateCode' },
  { back: 'ofm_facility_business_bceid', front: 'facilities' },
]

const UserFacilityMappings = [
  { back: 'ofm_bceid_facilityid', front: 'facilityId' },
  { back: 'ofm_facility', front: 'ofmFacility' },
]

const UserFacilityDetailMappings = [
  { back: 'accountid', front: 'accountId' },
  { back: 'accountnumber', front: 'accountNumber' },
  { back: 'name', front: 'facilityName' },
  { back: 'address1_composite', front: 'address' },
]

const FacilityMappings = [
  { back: 'ofm_bceid_facilityid', front: 'facilityId' },
  { back: '_ofm_facility_value@OData.Community.Display.V1.FormattedValue', front: 'facilityName' },
  { back: 'statecode', front: 'stateCode' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'ofm_facility', front: 'address' },
]

module.exports = {
  AssistanceRequestMappings,
  AssistanceRequestFacilityMappings,
  AssistanceRequestConversationMappings,
  FacilityMappings,
  NotificationMappings,
  UserFacilityMappings,
  UserFacilityDetailMappings,
  UserMappings,
  UserProfileFacilityMappings,
  UserProfileMappings,
  UserProfileOrganizationMappings,
  RequestCategoryMappings,
}
