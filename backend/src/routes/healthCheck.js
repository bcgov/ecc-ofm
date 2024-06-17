const express = require('express')
const HttpStatus = require('http-status-codes')
const router = express.Router()

router.get('/', (_req, res) => {
  res.sendStatus(HttpStatus.OK)
})

module.exports = router
