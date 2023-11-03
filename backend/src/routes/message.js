const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken= auth.isValidBackendToken();
const { getAllMessages, updateMessageLastOpenedTime, createNewAssistanceRequest } = require('../components/message');
const { param, validationResult, checkSchema } = require('express-validator');

module.exports = router;

const newAssistanceRequestSchema = {
  contactId: {
    in: ['body'],
    exists: { errorMessage: '[contactId] is required', }
  },
  requestCategoryId: {
    in: ['body'],
    exists: { errorMessage: '[requestCategoryId] is required', }
  },
  subject: {
    in: ['body'],
    exists: { errorMessage: '[subject] is required', }
  },
  description: {
    in: ['body'],
    exists: { errorMessage: '[description] is required', }
  },
  facilities: {
    in: ['body'],
    exists: { errorMessage: '[facilities] is required', }
  },
  contactMethod: {
    in: ['body'],
    exists: { errorMessage: '[contactMethod] is required', }
  }
};

/**
 * Get ALL messages of an organization
 */
router.get('/organization/:organizationId', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return getAllMessages(req, res);
  });

/**
 * Update Last Opened Time of an existing Message
 */
router.put('/:messageId', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  param('messageId', 'URL param: [messageId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw();
  return updateMessageLastOpenedTime(req, res);
});

/**
 * Create a new Assistance Request
 */
router.post('/newAssistanceRequest', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  checkSchema(newAssistanceRequestSchema)], (req, res) => { 
  validationResult(req).throw();
  return createNewAssistanceRequest(req, res);
});

module.exports = router;
