'use strict'

import { SUPPLEMENTARY_APPLICATION_STATUS_CODES } from '@/utils/constants'

export function isApplicationLocked(applicationStatusCode) {
  if (!applicationStatusCode) {
    return false
  }
  return !(
    applicationStatusCode === SUPPLEMENTARY_APPLICATION_STATUS_CODES.DRAFT ||
    applicationStatusCode === SUPPLEMENTARY_APPLICATION_STATUS_CODES.ACTION_REQUIRED
  )
}

// Check the list of models for multiples of the same VIN.
// We need length > 1 to enforce that there are VINS that exactly match which breaks our validation rule
export function hasDuplicateVIN(model, transportModels) {
  return transportModels.filter((m) => m.VIN === model.VIN).length > 1
}

export function convertStringToArray(item, separator = ',') {
  return typeof item === 'string' ? item?.split(separator) : item
}

export function convertArrayToString(item, separator = ', ') {
  return Array.isArray(item) ? item?.join(separator) : item
}

export function sanitizeWholeNumberInput(input) {
  return input?.replace(/[^0-9]/g, '')
}

export function createPDFDownloadLink(file, fileName) {
  const link = document.createElement('a')
  link.href = `data:application/pdf;base64,${file}`
  link.target = '_blank'
  link.download = fileName

  // Simulate a click on the element <a>
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
