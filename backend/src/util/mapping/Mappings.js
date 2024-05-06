const UserProfileMappings = [
  { back: 'contactid', front: 'contactId' },
  { back: 'ccof_userid', front: 'userId' },
  { back: 'ccof_username', front: 'userName' },
  { back: 'emailaddress1', front: 'email' },
  { back: 'ofm_first_name', front: 'firstName' },
  { back: 'ofm_last_name', front: 'lastName' },
  { back: 'role', front: 'role' },
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
  { back: 'ofm_program', front: 'programCode' },
  { back: 'statecode', front: 'facilityStateCode' },
  { back: 'statuscode', front: 'facilityStatusCode' },
]

const RequestCategoryMappings = [
  { back: 'ofm_name', front: 'categoryName' },
  { back: 'ofm_request_categoryid', front: 'categoryId' },
]

const RequestSubCategoryMappings = [
  { back: 'ofm_name', front: 'categoryName' },
  { back: 'ofm_subcategoryid', front: 'subCategoryId' },
]

const FiscalYearMappings = [
  { back: 'ofm_fiscal_yearid', front: 'fiscalYearId' },
  { back: 'ofm_caption', front: 'name' },
  { back: 'ofm_fiscal_year_number', front: 'order' },
  { back: 'ofm_start_date', front: 'startDate' },
  { back: 'ofm_end_date', front: 'endDate' },
  { back: 'statecode', front: 'stateCode' },
  { back: 'statuscode', front: 'statusCode' },
]

const MonthMappings = [
  { back: 'ofm_monthid', front: 'monthId' },
  { back: 'ofm_name', front: 'name' },
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
  { back: 'role', front: 'role' },
  { back: 'statecode', front: 'stateCode' },
  { back: 'ofm_facility_business_bceid', front: 'facilities' },
]

const UserFacilityMappings = [
  { back: 'ofm_bceid_facilityid', front: 'bceidFacilityId' },
  { back: '_ofm_facility_value', front: 'facilityId' },
]

const UserFacilityDetailMappings = [
  { back: 'accountnumber', front: 'accountNumber' },
  { back: 'name', front: 'facilityName' },
  { back: 'address1_composite', front: 'address' },
  { back: 'ofm_program', front: 'programCode' },
]

const UsersPermissionsFacilityMappings = [
  { back: 'ofm_bceid_facilityid', front: 'bceidFacilityId' },
  { back: '_ofm_facility_value', front: 'facilityId' },
  { back: '_ofm_facility_value@OData.Community.Display.V1.FormattedValue', front: 'facilityName' },
  { back: 'statecode', front: 'stateCode' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'ofm_facility', front: 'address' },
  { back: 'ofm_portal_access', front: 'ofmPortalAccess' },
  { back: 'ofm_is_expense_authority', front: 'isExpenseAuthority' },
  { back: 'ofm_is_additional_contact', front: 'isAdditionalContact' },
]

const ApplicationMappings = [
  { back: 'ofm_applicationid', front: 'applicationId' },
  { back: 'ofm_application', front: 'referenceNumber' },
  { back: 'ofm_summary_submittedon', front: 'submittedDate' },
  { back: 'ofm_summary_submittedby', front: 'submittedBy' },
  { back: 'ofm_summary_ministry_last_updated', front: 'ministryLastUpdated' },
  { back: 'ofm_summary_provider_last_updated', front: 'providerLastUpdated' },
  { back: '_ofm_facility_value', front: 'facilityId' },
  { back: '_ofm_facility_value@OData.Community.Display.V1.FormattedValue', front: 'facilityName' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'statecode', front: 'stateCode' },
  { back: 'statuscode@OData.Community.Display.V1.FormattedValue', front: 'status' },
  { back: 'ofm_staff_infant_ec_educator_ft', front: 'staffingInfantECEducatorFullTime' },
  { back: 'ofm_staff_infant_ec_educator_pt', front: 'staffingInfantECEducatorPartTime' },
  { back: 'ofm_staff_ec_educator_ft', front: 'staffingECEducatorFullTime' },
  { back: 'ofm_staff_ec_educator_pt', front: 'staffingECEducatorPartTime' },
  { back: 'ofm_staff_ec_educator_assistant_ft', front: 'staffingECEducatorAssistantFullTime' },
  { back: 'ofm_staff_ec_educator_assistant_pt', front: 'staffingECEducatorAssistantPartTime' },
  { back: 'ofm_staff_responsible_adult_ft', front: 'staffingResponsibleAdultFullTime' },
  { back: 'ofm_staff_responsible_adult_pt', front: 'staffingResponsibleAdultPartTime' },
  { back: '_ofm_contact_value', front: 'primaryContactId' },
  { back: '_ofm_secondary_contact_value', front: 'secondaryContactId' },
  { back: '_ofm_expense_authority_value', front: 'expenseAuthorityId' },
  { back: 'ofm_provider_type', front: 'providerType' },
  { back: 'ofm_summary_ownership', front: 'ownership' },
  { back: 'ofm_costs_facility_type', front: 'facilityType' },
  { back: 'ofm_costs_property_insurance', front: 'insuranceCost' },
  { back: 'ofm_costs_upkeep_labour_supplies', front: 'upkeepLabourCost' },
  { back: 'ofm_costs_supplies', front: 'suppliesCost' },
  { back: 'ofm_costs_utilities', front: 'utilitiesCost' },
  { back: 'ofm_costs_maintenance_repairs', front: 'maintenanceRepairsCost' },
  { back: 'ofm_costs_furniture_equipment', front: 'furnitureEquipmentsCost' },
  { back: 'ofm_costs_yearly_operating_costs', front: 'totalYearlyOperatingCosts' },
  { back: 'ofm_costs_rent_lease', front: 'rentLeaseCost' },
  { back: 'ofm_costs_mortgage', front: 'mortgageCost' },
  { back: 'ofm_costs_property_municipal_tax', front: 'propertyTax' },
  { back: 'ofm_costs_strata_fee', front: 'strataFee' },
  { back: 'ofm_costs_applicable_fee', front: 'applicableFee' },
  { back: 'ofm_costs_year_facility_costs', front: 'totalYearlyFacilityCosts' },
  { back: 'ofm_licence_declaration', front: 'licenceDeclaration' },
  { back: 'ofm_summary_declaration', front: 'applicationDeclaration' },
]

const OrganizationMappings = [
  { back: 'accountid', front: 'organizationId' },
  { back: 'accountnumber', front: 'accountNumber' },
  { back: 'name', front: 'name' },
  { back: 'emailaddress1', front: 'email' },
  { back: 'ofm_business_type', front: 'businessTypeCode' },
  { back: 'ofm_business_type@OData.Community.Display.V1.FormattedValue', front: 'businessType' },
  { back: 'ofm_doing_business_as', front: 'doingBusinessAsName' },
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
  { back: 'ofm_provider_type', front: 'providerType' },
  { back: 'ofm_ownership', front: 'ownership' },
  { back: 'ofm_inclusion_policy', front: 'hasInclusionPolicy' },
  { back: 'ofm_good_standing_status', front: 'goodStandingStatusCode' },
  { back: 'ofm_good_standing_status@OData.Community.Display.V1.FormattedValue', front: 'goodStandingStatus' },
]

const FacilityMappings = [
  { back: 'accountid', front: 'facilityId' },
  { back: 'accountnumber', front: 'accountNumber' },
  { back: 'name', front: 'name' },
  { back: 'telephone1', front: 'phoneLandline' },
  { back: 'telephone2', front: 'phoneCell' },
  { back: 'emailaddress1', front: 'email' },
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
  { back: '_ofm_primarycontact_value', front: 'primaryContactId' },
  { back: 'ofm_program', front: 'programCode' },
]

const ContactMappings = [
  { back: 'entityID', front: 'contactId' },
  { back: 'ofm_first_name', front: 'firstName' },
  { back: 'ofm_last_name', front: 'lastName' },
  { back: 'telephone1', front: 'phone' },
  { back: 'emailaddress1', front: 'email' },
  { back: 'role', front: 'role' },
  { back: 'statecode', front: 'stateCode' },
]

const LicenceMappings = [
  { back: 'ofm_licenceid', front: 'licenceId' },
  { back: 'ofm_licence', front: 'licence' },
  { back: 'ofm_health_authority', front: 'healthAuthorityId' },
  { back: 'ofm_tdad_funding_agreement_number', front: 'tdadFundingAgreementNumber' },
  { back: 'ofm_accb_providerid', front: 'accbProviderId' },
  { back: 'ofm_ccof_organizationid', front: 'ccofOrganizationId' },
  { back: 'ofm_ccof_facilityid', front: 'ccofFacilityId' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'statecode', front: 'stateCode' },
]

const LicenceDetailsMappings = [
  { back: 'ofm_licence_detailid', front: 'licenceDetailId' },
  { back: 'ofm_licence_type', front: 'licenceType' },
  { back: 'ofm_licence_spaces', front: 'licenceSpaces' },
  { back: 'ofm_operational_spaces', front: 'operationalSpaces' },
  { back: 'ofm_enrolled_spaces', front: 'enrolledSpaces' },
  { back: 'ofm_operation_from_time', front: 'operationFromTime' },
  { back: 'ofm_operations_to_time', front: 'operationToTime' },
  { back: 'ofm_week_days', front: 'weekDays' },
  { back: 'ofm_weeks_in_operation', front: 'weeksInOperation' },
  { back: 'ofm_care_type', front: 'careType' },
  { back: 'ofm_overnight_care', front: 'overnightCare' },
  { back: 'ofm_apply_room_split_condition', front: 'applyRoomSplitCondition' },
  { back: 'ofm_room_split_details', front: 'roomSplitDetails' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'statecode', front: 'stateCode' },
]

const DocumentMappings = [
  { back: 'ofm_documentid', front: 'documentId' },
  { back: 'ofm_name', front: 'referenceNumber' },
  { back: 'ofm_file_name', front: 'fileName' },
  { back: 'ofm_subject', front: 'subject' },
  { back: 'ofm_description', front: 'description' },
  { back: 'ofm_category', front: 'documentType' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'statecode', front: 'stateCode' },
  { back: 'modifiedon', front: 'lastUpdatedTime' },
  { back: '_ofm_regardingid_value', front: 'regardingId' },
]

const FundingAgreementMappings = [
  { back: 'ofm_fundingid', front: 'fundingId' },
  { back: 'ofm_funding_number', front: 'fundingAgreementNumber' },
  { back: '_ofm_application_value', front: 'applicationId' },
  { back: 'ofm_start_date', front: 'startDate' },
  { back: 'ofm_end_date', front: 'endDate' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'statecode', front: 'stateCode' },
  { back: 'ofm_declaration', front: 'agreeConsentCertify' },
]
//the three different supp applications share the same data structure, so irrelevant fields will just be null.
const SupplementaryApplicationMappings = [
  { back: 'ofm_allowanceid', front: 'supplementaryApplicationId' },
  { back: 'ofm_allowance_number', front: 'supplementaryReferenceNumber' },
  { back: '_ofm_application_value', front: 'applicationId' },
  { back: 'statuscode@OData.Community.Display.V1.FormattedValue', front: 'supplementaryApplicationStatus' },
  { back: 'ofm_submittedon', front: 'supplementaryApplicationSubmittedDate' },
  { back: 'ofm_allowance_type', front: 'supplementaryType' },
  { back: 'ofm_allowance_type@OData.Community.Display.V1.FormattedValue', front: 'supplementaryTypeDescription' },
  { back: 'ofm_indigenous_expenses', front: 'indigenousFundingModel' },
  { back: 'ofm_indigenous_description', front: 'indigenousOtherDescription' },
  { back: 'ofm_needs_description', front: 'supportOtherDescription' },
  { back: 'ofm_needs_expenses', front: 'supportFundingModel' },
  { back: 'ofm_summary_ministry_last_updated', front: 'ministryLastUpdated' },
  { back: 'ofm_summary_provider_last_updated', front: 'providerLastUpdated' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'statecode', front: 'stateCode' },
  { back: 'ofm_transport_monthly_lease', front: 'monthlyLease' },
  { back: 'ofm_transport_estimated_yearly_km', front: 'estimatedMileage' },
  { back: 'ofm_transport_odometer', front: 'odometer' },
  { back: 'ofm_transport_vehicle_vin', front: 'VIN' },
  { back: 'ofm_summary_declaration', front: 'supplementaryDeclaration' },
  { back: 'ofm_start_date', front: 'startDate' },
  { back: 'ofm_end_date', front: 'endDate' },
  { back: 'ofm_renewal_term', front: 'renewalTerm' },
]

const RoleMappings = [
  { back: 'ofm_name', front: 'roleName' },
  { back: 'ofm_portal_role_number', front: 'roleNumber' },
  { back: 'ofm_portal_roleid', front: 'roleId' },
]

const PermissionMappings = [
  { back: 'ofm_name', front: 'permissionName' },
  { back: 'ofm_portal_privilege_number', front: 'permissionNumber' },
]

const SurveySectionMappings = [
  { back: 'ofm_sectionid', front: 'sectionId' },
  { back: 'ofm_section_title', front: 'title' },
  { back: 'ofm_section_order', front: 'order' },
  { back: '_ofm_survey_value', front: 'surveyId' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'statecode', front: 'stateCode' },
]

const SurveyQuestionMappings = [
  { back: 'ofm_questionid', front: 'questionId' },
  { back: 'ofm_question_text', front: 'text' },
  { back: 'ofm_question_type', front: 'type' },
  { back: 'ofm_sequence', front: 'sequence' },
  { back: 'ofm_question_choice', front: 'choices' },
  { back: 'ofm_response_required', front: 'responseRequired' },
  { back: '_ofm_header_value', front: 'tableQuestionId' },
  { back: 'ofm_maximum_rows', front: 'tableMaxRows' },
  { back: 'ofm_occurence@OData.Community.Display.V1.FormattedValue', front: 'surveyResponseType' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'statecode', front: 'stateCode' },
]

const SurveyQuestionBusinessRulesMappings = [
  { back: 'ofm_question_business_ruleid', front: 'businessRuleId' },
  { back: '_ofm_true_child_question_value', front: 'trueChildQuestionId' },
  { back: '_ofm_false_child_question_value', front: 'falseChildQuestionId' },
  { back: 'ofm_condition', front: 'conditionValue' },
  { back: 'ofm_parent_has_response', front: 'parentHasResponse' },
  { back: '_ofm_child_question_value', front: 'valueInheritanceChildQuestionId' },
]

const SurveyResponseMappings = [
  { back: 'ofm_survey_responseid', front: 'surveyResponseId' },
  { back: 'ofm_response_id', front: 'surveyResponseReferenceNumber' },
  { back: '_ofm_survey_value', front: 'surveyId' },
  { back: '_ofm_contact_value', front: 'contactId' },
  { back: '_ofm_facility_value', front: 'facilityId' },
  { back: '_ofm_fiscal_year_value', front: 'fiscalYearId' },
  { back: '_ofm_reporting_month_value', front: 'reportingMonthId' },
  { back: '_ofm_submitted_month_value', front: 'submittedMonthId' },
  { back: 'ofm_response_type', front: 'surveyResponseType' },
  { back: 'ofm_start_date', front: 'startDate' },
  { back: 'ofm_end_date', front: 'endDate' },
  { back: 'statuscode', front: 'statusCode' },
  { back: 'statecode', front: 'stateCode' },
]

const QuestionResponseMappings = [
  { back: 'ofm_question_responseid', front: 'questionResponseId' },
  { back: '_ofm_survey_response_value', front: 'surveyResponseId' },
  { back: '_ofm_question_value', front: 'questionId' },
  { back: '_ofm_header_value', front: 'tableQuestionId' },
  { back: 'ofm_row_id', front: 'rowId' },
  { back: 'ofm_response_text', front: 'value' },
]

module.exports = {
  ApplicationMappings,
  AssistanceRequestMappings,
  AssistanceRequestFacilityMappings,
  AssistanceRequestConversationMappings,
  ContactMappings,
  DocumentMappings,
  FacilityMappings,
  FiscalYearMappings,
  FundingAgreementMappings,
  LicenceMappings,
  LicenceDetailsMappings,
  MonthMappings,
  NotificationMappings,
  OrganizationMappings,
  PermissionMappings,
  QuestionResponseMappings,
  RequestCategoryMappings,
  RequestSubCategoryMappings,
  RoleMappings,
  SupplementaryApplicationMappings,
  SurveySectionMappings,
  SurveyQuestionMappings,
  SurveyQuestionBusinessRulesMappings,
  SurveyResponseMappings,
  UserFacilityDetailMappings,
  UserFacilityMappings,
  UserMappings,
  UsersPermissionsFacilityMappings,
  UserProfileFacilityMappings,
  UserProfileMappings,
  UserProfileOrganizationMappings,
}
