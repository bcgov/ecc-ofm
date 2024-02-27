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

module.exports = {
  buildFilterQuery,
}
