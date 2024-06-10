import moment from 'moment'

import { BLANK_FIELD } from '@/utils/constants'

function formatDate(date) {
  if (!date) return BLANK_FIELD
  return moment.utc(date).format('YYYY-MMM-DD')
}

function formatDateTime(date) {
  if (!date) return BLANK_FIELD
  return moment(date).format('YYYY-MMM-DD hh:mm A')
}

function formatDateToUTC(date) {
  return new Date(date).toLocaleString('en-CA', { timeZone: 'UTC', dateStyle: 'full' })
}

/**
 * This function will return a decimal number in this format ###,###,###.## (e.g.: 123,456,999.12).
 * You can specify the number of fraction digits using "numberOfFractionDigits". Default is 2 fractional digits
 * If "decimalNumber" is not a Number, it will be set to 0 as the default value.
 */
function formatDecimalNumber(decimalNumber, numberOfFractionDigits = 2) {
  const formattedNumber = isNaN(Number(decimalNumber)) ? 0 : Number(decimalNumber)
  return formattedNumber.toLocaleString('en-CA', { minimumFractionDigits: numberOfFractionDigits, maximumFractionDigits: numberOfFractionDigits })
}

export default {
  formatDate,
  formatDateTime,
  formatDecimalNumber,
  formatDateToUTC,
}
