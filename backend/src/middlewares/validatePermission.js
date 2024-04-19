const jsonwebtoken = require('jsonwebtoken')
const log = require('../components/logger')
const { getRoles } = require('../components/lookup')

module.exports = function (permission) {
  return async function (req, res, next) {
    log.info(`validating permission ${permission}`)

    const userRole = req.session?.passport?.user?.role

    if (!userRole) {
      res.sendStatus(403)
    }

    const roles = await getRoles()
    const matchingRole = roles.find((role) => role.data.roleId === userRole.ofm_portal_roleid)
    const permissions = matchingRole ? matchingRole.data.permissions : []

    const valid = permissions.some((p) => p.permissionName === permission)

    valid ? next() : res.sendStatus(403)
  }
}
