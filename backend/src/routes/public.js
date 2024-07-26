const express = require('express')
const router = express.Router()
const { getSystemMessages } = require('../components/public')

router.get('/system-messages', (req, res) => {
  getSystemMessages(req, res)
})

module.exports = router
