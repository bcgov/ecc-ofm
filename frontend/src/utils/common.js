'use strict'

import { SUPPLEMENTARY_APPLICATION_STATUS_CODES } from '@/utils/constants'

/**
 * This function will return a decimal number in this format ###,###,###.## (e.g.: 123,456,999.12).
 * You can specify the number of fraction digits using "numberOfFractionDigits". Default is 2 fractional digits
 * If "decimalNumber" is not a Number, it will be set to 0 as the default value.
 */
export function formatDecimalNumber(decimalNumber, numberOfFractionDigits = 2) {
  const formattedNumber = isNaN(Number(decimalNumber)) ? 0 : Number(decimalNumber)
  return formattedNumber.toLocaleString('en-CA', { minimumFractionDigits: numberOfFractionDigits, maximumFractionDigits: numberOfFractionDigits })
}

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

/**
 * This function will convert a String to an Array.
 */
export function convertStringToArray(item, separator = ',') {
  return typeof item === 'string' ? item?.split(separator) : item
}

export function sanitizeWholeNumberInput(input) {
  return input?.replace(/[^0-9]/g, '')
}
