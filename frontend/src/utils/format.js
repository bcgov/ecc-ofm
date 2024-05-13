import moment from 'moment'

import { BLANK_FIELD } from '@/utils/constants'
import { DateTimeFormatterBuilder, LocalDate, LocalDateTime, ResolverStyle } from '@js-joda/core'

function formatPen(pen) {
  if (pen?.length === 9) {
    return (pen && pen.substring(0, 3) + ' ' + pen.substring(3, 6) + ' ' + pen.substring(6)) || ''
  }
  return pen
}

function getDateFormatter(pattern) {
  return new DateTimeFormatterBuilder().appendPattern(pattern).toFormatter(ResolverStyle.STRICT)
}

function formatTableColumn(format, column) {
  return format && column ? format(column) : column || ' '
}

function formatMincode(mincode) {
  return mincode
}

function formatPostalCode(postalCode) {
  return postalCode
}

const GRADE_CODE_MAP = Object.freeze({
  K: 'KF',
  UE: 'EU',
  US: 'SU',
})

function formatGrade(grade) {
  return GRADE_CODE_MAP[grade] || grade.padStart(2, '0')
}

function formatDistrictNumber(districtNumber) {
  return districtNumber.padStart(3, '0')
}

function sortByNameValue(list, valueToSortBy) {
  return list.sort(function (a, b) {
    if (a[valueToSortBy] > b[valueToSortBy]) {
      return 1
    } else if (a[valueToSortBy] < b[valueToSortBy]) {
      return -1
    }
    return 0
  })
}

function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    return ''
  }

  if (phoneNumber?.length === 10) {
    return `${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`
  }

  return 'Phone number format not recognized'
}

function formatDate(date) {
  if (!date) return BLANK_FIELD
  return moment.utc(date).format('YYYY-MMM-DD')
}

function formatDateTime(date) {
  if (!date) return BLANK_FIELD
  return moment(date).format('YYYY-MMM-DD hh:mm A')
}

function formatContactName(contact) {
  return contact.firstName ? `${contact.firstName} ${contact.lastName}` : contact.lastName
}

export default {
  formatDate,
  formatDateTime,
}
