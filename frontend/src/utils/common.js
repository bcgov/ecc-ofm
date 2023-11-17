'use strict'

import { DateTimeFormatter, LocalDate } from '@js-joda/core'
import { filter, isPlainObject, sortBy } from 'lodash'

import ApiService from '@/common/apiService'
import rfdc from 'rfdc/default'

export function deepCloneObject(objectToBeCloned) {
  const cloned = rfdc(objectToBeCloned)
  return cloned
}

export function equalsIgnoreCase(param1, param2) {
  return param1?.toLowerCase() === param2?.toLowerCase()
}

export function sortArrayByDate(array, dateFieldName, isAscending, datePattern = 'uuuuMMdd') {
  return array.sort((a, b) => {
    const dateA = getLocalDateFromString(a[`${dateFieldName}`].toString(), datePattern)
    const dateB = getLocalDateFromString(b[`${dateFieldName}`].toString(), datePattern)
    return isAscending ? dateA.compareTo(dateB) : dateB.compareTo(dateA)
  })
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * This function will return the first letter of each word in the camel case string, like "penRequestBatch" will return "prb"
 */
export function abbreviateCamelCase(string) {
  return string
    .replace(/([A-Z])/g, ' $1')
    .match(/\b(\w)/g)
    .join('')
    .toLowerCase()
}
