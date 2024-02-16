const ASSISTANCE_REQUEST_STATUS_CODES = Object.freeze({
  OPEN: [1, 2, 4], // 1 = Submitted, 2 = Assigned, 4 = Ready to Resolve
  CLOSED: [5, 6], // 5 = Closed - Complete, 6 = Closed - Cancelled
  ACTION_REQUIRED: [3], // 3 = With Provider
})

const SCAN_RESULTS = Object.freeze({
  VIRUS_FOUND: 'FOUND',
})

module.exports = {
  ASSISTANCE_REQUEST_STATUS_CODES,
  SCAN_RESULTS,
}
