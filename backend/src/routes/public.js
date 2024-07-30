const express = require('express')
const router = express.Router()
const { getSystemMessages } = require('../components/lookup')

router.get('/system-messages', (req, res) => {
  getSystemMessages(req, res)
})

module.exports = router
