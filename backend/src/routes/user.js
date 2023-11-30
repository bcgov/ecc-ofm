'use strict'

const passport = require('passport')
const express = require('express')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()

const { getUserInfo, getUsersPermissionsFacilities } = require('../components/user')

router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, getUserInfo)

router.get('/:queryUserName', passport.authenticate('jwt', { session: false }), isValidBackendToken, getUserInfo)

router.get('/facilities/:organizationId', passport.authenticate('jwt', { session: false }), isValidBackendToken, getUsersPermissionsFacilities)

module.exports = router
