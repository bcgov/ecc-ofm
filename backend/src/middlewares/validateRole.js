const log = require('../components/logger')

module.exports = function (role) {
  return async function (req, res, next) {
    log.verbose(`validating role ${role}`)
    const userRole = req.session?.passport?.user?.role
    if (!userRole) return res.sendStatus(403)
    !role || userRole.roleName === role ? next() : res.sendStatus(403)
  }
}
