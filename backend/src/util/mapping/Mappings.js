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
  { back: 'ofm_is_primary_contact', front: 'isPrimaryContact' },
]

const UserFacilityMappings = [
  { back: 'ofm_bceid_facilityid', front: 'bceidFacilityId' },
  { back: '_ofm_facility_value', front: 'facilityId' },
]

const UserFacilityDetailMappings = [
  { back: 'accountnumber', front: 'accountNumber' },
  { back: 'name', front: 'facilityName' },
  { back: 'address1_composite', front: 'address' },
]

const UsersPermissionsFacilityMappings = [
  { back: 'ofm_bceid_facilityid', front: 'bceidFacilityId' },
  { back: '_ofm_facility_value', front: 'facilityId' },
  { back: '_ofm_facility_value@OData.Community.Display.V1.FormattedValue', front: 'facilityName' },
  { back: 'statecode', front: 'stateCode' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'ofm_facility', front: 'address' },
  { back: 'ofm_portal_access', front: 'ofmPortalAccess' },
]

const ApplicationMappings = [
  { back: 'ofm_applicationid', front: 'applicationId' },
  { back: 'ofm_application', front: 'referenceNumber' },
  { back: 'ofm_summary_submittedon', front: 'submittedDate' },
  { back: 'ofm_summary_ministry_last_updated', front: 'ministryLastUpdated' },
  { back: 'ofm_summary_provider_last_updated', front: 'providerLastUpdated' },
  { back: '_ofm_facility_value', front: 'facilityId' },
  { back: '_ofm_facility_value@OData.Community.Display.V1.FormattedValue', front: 'facilityName' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'statecode', front: 'stateCode' },
  { back: 'statuscode@OData.Community.Display.V1.FormattedValue', front: 'status' },
]

const OrganizationMappings = [
  { back: 'accountid', front: 'organizationId' },
  { back: 'accountnumber', front: 'accountNumber' },
  { back: 'name', front: 'name' },
  { back: 'emailaddress1', front: 'email' },
  { back: 'ofm_business_type', front: 'businessTypeCode' },
  { back: 'ofm_business_type@OData.Community.Display.V1.FormattedValue', front: 'businessType' },
  { back: 'telephone1', front: 'phoneLandline' },
  { back: 'telephone2', front: 'phoneCell' },
  { back: 'address1_line1', front: 'streetAddress1' },
  { back: 'address1_line2', front: 'streetAddress2' },
  { back: 'address1_city', front: 'city' },
  { back: 'address1_postalcode', front: 'postalCode' },
  { back: 'address1_stateorprovince', front: 'province' },
  { back: 'ofm_is_mailing_address_different', front: 'isMailingAddressDifferent' },
  { back: 'address2_line1', front: 'mailingStreetAddress1' },
  { back: 'address2_line2', front: 'mailingStreetAddress2' },
  { back: 'address2_city', front: 'mailingCity' },
  { back: 'address2_postalcode', front: 'mailingPostalCode' },
  { back: 'address2_stateorprovince', front: 'mailingProvince' },
  { back: 'statecode', front: 'stateCode' },
  { back: 'statuscode', front: 'statusCode' },
]

const FacilityMappings = [
  { back: 'accountid', front: 'facilityId' },
  { back: 'accountnumber', front: 'accountNumber' },
  { back: 'name', front: 'name' },
  { back: 'address1_line1', front: 'streetAddress1' },
  { back: 'address1_line2', front: 'streetAddress2' },
  { back: 'address1_city', front: 'city' },
  { back: 'address1_postalcode', front: 'postalCode' },
  { back: 'address1_stateorprovince', front: 'province' },
  { back: 'ofm_is_mailing_address_different', front: 'isMailingAddressDifferent' },
  { back: 'address2_line1', front: 'mailingStreetAddress1' },
  { back: 'address2_line2', front: 'mailingStreetAddress2' },
  { back: 'address2_city', front: 'mailingCity' },
  { back: 'address2_postalcode', front: 'mailingPostalCode' },
  { back: 'address2_stateorprovince', front: 'mailingProvince' },
  { back: 'statecode', front: 'stateCode' },
  { back: 'statuscode', front: 'statusCode' },
]

const ContactMappings = [
  { back: 'entityID', front: 'contactId' },
  { back: 'ofm_first_name', front: 'firstName' },
  { back: 'ofm_last_name', front: 'lastName' },
  { back: 'telephone1', front: 'phone' },
  { back: 'emailaddress1', front: 'email' },
  { back: 'ofm_portal_role', front: 'role' },
  { back: 'statecode', front: 'stateCode' },
]

const LicenceMappings = [
  { back: 'ofm_licenceid', front: 'licenceId' },
  { back: 'ofm_licence', front: 'licence' },
  { back: 'ofm_health_authority', front: 'healthAuthorityId' },
  { back: 'statuscode', front: 'statusCode' },
]

module.exports = {
  ApplicationMappings,
  AssistanceRequestMappings,
  AssistanceRequestFacilityMappings,
  AssistanceRequestConversationMappings,
  ContactMappings,
  FacilityMappings,
  LicenceMappings,
  NotificationMappings,
  OrganizationMappings,
  UserFacilityDetailMappings,
  UserFacilityMappings,
  UserMappings,
  UsersPermissionsFacilityMappings,
  UserProfileFacilityMappings,
  UserProfileMappings,
  UserProfileOrganizationMappings,
  RequestCategoryMappings,
}
