'use strict'
const { getOperation } = require('./utils')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const HttpStatus = require('http-status-codes')
const { isEmpty } = require('lodash')

async function getFacilityReports(req, res) {
  try {
    const data = [
      {
        alertType: 'Overdue',
        title: '2022 Provider Profile',
        reportType: 'Annual',
        reportId: 'AR-1104100006',
        status: '',
        lastActivityDate: '',
        actions: 'Open (launches blank)',
      },
      {
        alertType: 'Due',
        title: 'December 2023',
        reportType: 'Monthly',
        reportId: 'MR-231200001',
        status: 'Draft',
        lastActivityDate: '1/12/2024',
        actions: 'Open/Discard',
      },
      {
        alertType: 'Completed',
        title: 'Quarterly Service Details Confirmation',
        reportType: 'Other',
        reportId: 'OR-224100006',
        status: 'Submitted',
        lastActivityDate: '2/2/2024',
        actions: 'Open/Download',
      },
    ]
    return res.status(HttpStatus.OK).json(data)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getFacilityReports,
}
