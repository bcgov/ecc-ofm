'use strict'
const { getOperation, handleError } = require('./utils')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const { IrregularExpenseMappings } = require('../util/mapping/Mappings')
const { buildFilterQuery } = require('../util/common')
const HttpStatus = require('http-status-codes')

const log = require('./logger')

async function getIrregularExpenseApplications(req, res) {
  try {
    const applications = []
    const operation = `ofm_expenses?$filter=(${buildFilterQuery(req?.query, IrregularExpenseMappings)})`
    console.log(operation)
    const response = await getOperation(operation)

    response?.value?.forEach((application) => applications.push(new MappableObjectForFront(application, IrregularExpenseMappings).toJSON()))

    return res.status(HttpStatus.OK).json(applications)
  } catch (e) {
    handleError(res, e)
  }
}

async function getIrregularExpensePDF(req, res) {
  try {
    const operation = `ofm_expenses(${req.params.expenseApplicationId})/ofm_file`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(response?.value)
  } catch (e) {
    handleError(res, e)
  }
}

async function getIrregularExpenseByID(req, res) {
  try {
    const operation = `ofm_expenses(${req.params.expenseApplicationId})`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, IrregularExpenseMappings).toJSON())
  } catch (e) {
    handleError(res, e)
  }
}

module.exports = {
  getIrregularExpenseApplications,
  getIrregularExpensePDF,
  getIrregularExpenseByID,
}
