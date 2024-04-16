const jsonwebtoken = require('jsonwebtoken')
const log = require('../components/logger')
const { getRoles } = require('../components/lookup')

module.exports = function (permission) {
  return async function (req, res, next) {
    log.verbose(`validating permission ${permission}`)

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const payload = jsonwebtoken.decode(token)

    const roles = await getRoles()
    const matchingRole = roles.find((role) => role.data.roleId === payload.role.ofm_portal_roleid)
    const permissions = matchingRole ? matchingRole.data.permissions : []

    const valid = permissions.some((p) => p.permissionName === permission)

    valid ? next() : res.sendStatus(403)
  }
}
