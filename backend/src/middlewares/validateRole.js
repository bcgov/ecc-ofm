const log = require('../components/logger')

module.exports = function () {
  return async function (req, res, next) {
    log.verbose('validating role')
    req.session?.passport?.user?.role ? next() : res.sendStatus(403)
  }
}
