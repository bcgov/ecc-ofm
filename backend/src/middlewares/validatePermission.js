const log = require('../components/logger')

module.exports = function (permission) {
  return function (req, res, next) {
    log.info(`validating permission ${permission}`)
    next()
  }
}
