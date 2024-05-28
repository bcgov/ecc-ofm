'use strict'
const { MappableObjectForBack } = require('../util/mapping/MappableObject')
const { isEmpty } = require('lodash')
const moment = require('moment')
const ISO_DATE_FORMAT = 'YYYY-MM-DD'

function buildFilterQuery(query, mapping) {
  if (isEmpty(query)) return
  let filterQuery = ''
  const mappedQuery = new MappableObjectForBack(query, mapping).toJSON()
  Object.entries(mappedQuery)?.forEach(([key, value]) => {
    filterQuery = isEmpty(filterQuery) ? filterQuery.concat(`${key} eq ${value}`) : filterQuery.concat(` and ${key} eq ${value}`)
  })
  return filterQuery
}

function buildDateFilterQuery(query, crmDateFieldName) {
  if (isEmpty(query)) return
  let filterQuery = ''
  if (query?.dateFrom) {
    const dateFrom = formatToISODateFormat(query.dateFrom)
    delete query.dateFrom
    filterQuery += `${crmDateFieldName} ge ${dateFrom} and `
  }
  if (query?.dateTo) {
    const dateTo = formatToISODateFormat(query.dateTo)
    delete query.dateTo
    filterQuery += `${crmDateFieldName} le ${dateTo} and `
  }
  return filterQuery
}

// Dynamics 365 expects OData queries on dates to be in ISO format
function formatToISODateFormat(dateString) {
  if (moment(dateString, ISO_DATE_FORMAT, true).isValid()) {
    return dateString
  }
  const date = moment(dateString)
  return date.isValid() ? date.format(ISO_DATE_FORMAT) : 'Invalid date'
}

module.exports = {
  buildDateFilterQuery,
  buildFilterQuery,
}
