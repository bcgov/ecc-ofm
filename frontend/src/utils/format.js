import { isEmpty } from 'lodash'
import moment from 'moment'
import momentTZ from 'moment-timezone'

import { BLANK_FIELD, TIME_ZONE } from '@/utils/constants'

function formatDate(date) {
  if (!date) return BLANK_FIELD
  return moment.utc(date).format('YYYY-MMM-DD')
}

function formatTwoMonthDate(date) {
  if (!date) return BLANK_FIELD
  return moment.utc(date).format('YYYY-MM-DD')
}

function formatDateTime(date) {
  if (!date) return BLANK_FIELD
  return moment(date).format('YYYY-MMM-DD hh:mm A')
}

function formatDateToUTC(date) {
  return new Date(date).toLocaleString('en-CA', { timeZone: 'UTC', dateStyle: 'full' })
}

function convertUTCDatetoPSTDate(date) {
  if (!date) return null
  const dateObject = new Date(date)
  const pstOffset = 8 * 60 // PST offset in minutes
  // Adjust the date by the difference in offsets
  const pstDate = new Date(dateObject.getTime() + pstOffset * 60000)
  return pstDate.toISOString().split('.')[0] + 'Z'
}

/* Example
- Input: 13:00
- Output: 2024-08-06 13:00:00 PDT
*/
function convertTimeToDateTimeFormat(time) {
  if (!time) return null
  const hours = time?.split(':')[0]
  const minutes = time?.split(':')[1]
  return momentTZ().tz(TIME_ZONE).hours(hours).minutes(minutes).seconds(0).milliseconds(0)
}

function formatTime12to24(time12h) {
  if (isEmpty(time12h) || !is12hFormat(time12h)) return time12h
  const [time, modifier] = time12h.split(' ')
  let [hours, minutes] = time.split(':')
  if (hours === '12') {
    hours = '00'
  }
  if (modifier?.toUpperCase() === 'PM') {
    hours = parseInt(hours, 10) + 12
  }
  return `${hours}:${minutes}`
}

function formatTime24to12(time24h) {
  if (isEmpty(time24h) || is12hFormat(time24h)) return time24h
  let hours = Number(time24h?.split(':')[0])
  const minutes = time24h?.split(':')[1]
  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`
}

function is12hFormat(time) {
  return time?.toUpperCase().includes('AM') || time?.toUpperCase().includes('PM')
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
  convertTimeToDateTimeFormat,
  convertUTCDatetoPSTDate,
  formatDate,
  formatDateTime,
  formatDecimalNumber,
  formatDateToUTC,
  formatTime12to24,
  formatTime24to12,
  formatTwoMonthDate,
}
