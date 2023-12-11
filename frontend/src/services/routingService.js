export const PATHS = {
  APPLICATIONS: 'applications',
  FACILITY_DETAILS: 'facility-details',
}

export function getApplicationUrl(suffix, applicationGuid = ':applicationGuid') {
  return `/${PATHS.APPLICATIONS}/${applicationGuid}/${suffix}`
}

export function getApplicationUrlGuid(suffix, applicationGuid = ':applicationGuid', urlGuid = ':urlGuid') {
  return `/${PATHS.APPLICATIONS}/${applicationGuid}/${suffix}/${urlGuid}`
}
