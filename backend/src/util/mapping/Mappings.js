const OrganizationMappings = [
  { back: 'ccof_facilitystartdate', front: 'yearBeganOperation' },
  { back: 'name', front: 'legalName' },
  { back: 'address1_name', front: 'address1' }, //Address
  { back: 'address1_city', front: 'city1' },
  { back: 'address1_postalcode', front: 'postalCode1' },
  { back: 'address2_name', front: 'address2' }, //Mailing Address
  { back: 'address2_city', front: 'city2' },
  { back: 'address2_postalcode', front: 'postalCode2' },
  { back: 'address1_primarycontactname', front: 'contactName' },
  { back: 'ccof_position', front: 'position' },
  { back: 'telephone1', front: 'phone' },
  { back: 'emailaddress1', front: 'email' },
  { back: 'ccof_instructionnumber', front: 'incNumber' },//incorporation number
  { back: 'ccof_typeoforganization', front: 'organizationType' },
  { back: 'ccof_formcomplete', front: 'isOrganizationComplete' },
  { back: 'ccof_is_mailing_address_same', front: 'isSameAsMailing'}
];

const ProgramYearMappings = [
  { back: 'ccof_program_yearid', front: 'programYearId' },
  { back: 'ccof_name', front: 'name' },
  { back: 'statuscode', front: 'status' },
  { back: 'ccof_programyearnumber', front: 'order' },
  { back: '_ccof_previousyear_value', front: 'previousYearId' },
  { back: 'ccof_intakeperiodstart', front: 'intakeStart' },
  { back: 'ccof_intakeperiodend', front: 'intakeEnd' },
  { back: 'ccof_declarationbstart', front: 'declarationbStart' },
];

module.exports = {
  OrganizationMappings,
  ProgramYearMappings
};
