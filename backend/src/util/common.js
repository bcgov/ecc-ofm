'use strict'
const { MappableObjectForBack } = require('../util/mapping/MappableObject')
const { isEmpty } = require('lodash')
const moment = require('moment')

function buildFilterQuery(query, mapping) {
  if (isEmpty(query)) return
  let filterQuery = ''
  const mappedQuery = new MappableObjectForBack(query, mapping).toJSON()
  Object.entries(mappedQuery)?.forEach(([key, value]) => {
    filterQuery = isEmpty(filterQuery) ? filterQuery.concat(`${key} eq ${value}`) : filterQuery.concat(` and ${key} eq ${value}`)
  })
  return filterQuery
}

// Dynamics 365 expects OData queries on dates to be in ISO format
function formatToISODateFormat(dateString) {
  if (moment(dateString, 'YYYY-MM-DD', true).isValid()) {
    return dateString
  }
  const date = moment(dateString)
  return date.isValid() ? date.format('YYYY-MM-DD') : 'Invalid date'
}

module.exports = {
  buildFilterQuery,
  formatToISODateFormat,
}
