'use strict'
const { MappableObjectForBack } = require('../util/mapping/MappableObject')
const { isEmpty } = require('lodash')

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
    const dateFrom = new Date(query.dateFrom).toISOString()
    filterQuery += `${crmDateFieldName} ge ${dateFrom} and `
  }
  if (query?.dateTo) {
    const dateTo = new Date(query.dateTo).toISOString()
    filterQuery += `${crmDateFieldName} le ${dateTo} and `
  }
  return filterQuery
}

/**
 * Dynamics can take a selector with a list of fields
 * Use this function to generate a list of fields based on mappings
 */
function getMappingString(mappings) {
  return mappings
    .map((item) => item.back)
    .filter((field) => !field.includes('@'))
    .join(',')
}

module.exports = {
  buildDateFilterQuery,
  buildFilterQuery,
  getMappingString,
}
