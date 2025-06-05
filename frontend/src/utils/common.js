'use strict'

import { SUPPLEMENTARY_APPLICATION_STATUS_CODES } from '@/utils/constants'

export function isApplicationLocked(applicationStatusCode) {
  if (!applicationStatusCode) {
    return false
  }
  return !(applicationStatusCode === SUPPLEMENTARY_APPLICATION_STATUS_CODES.DRAFT || applicationStatusCode === SUPPLEMENTARY_APPLICATION_STATUS_CODES.ACTION_REQUIRED)
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

export function createFileDownloadLink(file, fileName) {
  const link = document.createElement('a')
  //this declares it as a PDF - but it works to download all file types.
  //JB tried to change the mimetype, but this is the only method that I found that detected the extension automatically, and let you open the file correctly
  link.href = `data:application/pdf;base64,${file}`
  link.target = '_blank'
  link.download = fileName

  // Simulate a click on the element <a>
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
