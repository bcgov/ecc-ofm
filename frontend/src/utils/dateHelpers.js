import moment from 'moment'

import { LocalDate } from '@js-joda/core'

export function findUpcomingDate(month, day) {
  let currentDate = LocalDate.now()
  let defaultUpcomingDate = new LocalDate(currentDate.year(), month, day)
  defaultUpcomingDate = defaultUpcomingDate.isBefore(currentDate) ? defaultUpcomingDate.plusYears(1) : defaultUpcomingDate
  return defaultUpcomingDate
}

export function parseDate(date) {
  if (!date) return null
  const [year, month, day] = date.split('/')
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

export function getMomentDate(date, format = 'YYYY/MM/DD LT') {
  if (date) {
    return moment(date).format(format)
  }
  return ''
}

export function getFromMomentDate(date) {
  if (date) {
    return moment(date).fromNow()
  }
  return ''
}
