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

export function hasDuplicateVIN(model, transportModels) {
  let duplicateVINs = 0

  for (const el of transportModels) {
    if (el.VIN === model.VIN) {
      duplicateVINs = duplicateVINs + 1
    }

    if (duplicateVINs > 1) {
      return true
    }
  }
  return false
}
