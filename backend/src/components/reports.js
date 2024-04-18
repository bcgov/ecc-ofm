'use strict'
const { getOperation, postOperation, patchOperationWithObjectId, deleteOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { SurveySectionMappings, SurveyQuestionMappings, SurveyResponseMappings, QuestionResponseMappings, SurveyQuestionBusinessRulesMappings } = require('../util/mapping/Mappings')

const HttpStatus = require('http-status-codes')
const { isEmpty } = require('lodash')

function mapQuestionObjectForFront(data) {
  const question = new MappableObjectForFront(data, SurveyQuestionMappings).toJSON()
  if (!isEmpty(question) && 'ofm_question_business_rule_ques' in data) {
    question.businessRules = []
    data['ofm_question_business_rule_ques']?.forEach((rule) => question?.businessRules.push(new MappableObjectForFront(rule, SurveyQuestionBusinessRulesMappings).toJSON()))
  }
  return question
}

/* Example of a fixed response query: "ofm_licence_details?$select=ofm_operational_spaces&$filter=ofm_licence_type eq 1 and (ofm_licence/_ofm_facility_value eq {accountid})"
   Note: There should be only 1 field in the select statement
*/
function mapFixedResponsesObjectForFront(fixedResponseQuery, data) {
  const startString = '$select='
  const endString = '&$filter'
  const startIndex = fixedResponseQuery?.indexOf(startString) + startString.length
  const endIndex = fixedResponseQuery?.indexOf(endString)
  const selectedField = fixedResponseQuery?.substring(startIndex, endIndex)
  if (isEmpty(data) || isEmpty(selectedField)) return
  let result
  data?.forEach((item) => {
    if (!result) {
      result = item[selectedField]
    } else {
      result += item[selectedField]
    }
  })
  return result
}

// TODO Remove this method when Reporting screen complete
async function getFacilityReports(req, res) {
  try {
    const data = [
      {
        alertType: 'Overdue',
        title: '2022 Provider Profile',
        reportType: 'Annual',
        reportId: 'AR-1104100006',
        status: '',
        lastActivityDate: '',
        actions: 'Open',
      },
      {
        alertType: 'Due',
        title: 'December 2023',
        reportType: 'Monthly',
        reportId: 'MR-231200001',
        status: 'Draft',
        lastActivityDate: '1/12/2024',
        actions: 'Open/Discard',
      },
      {
        alertType: 'Completed',
        title: 'Quarterly Service Details Confirmation',
        reportType: 'Other',
        reportId: 'OR-224100006',
        status: 'Submitted',
        lastActivityDate: '2/2/2024',
        actions: 'Open/Download',
      },
    ]
    return res.status(HttpStatus.OK).json(data)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getSurveySections(req, res) {
  try {
    if (isEmpty(req?.query)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Query parameter is required' })
    }
    const sections = []
    const operation = `ofm_sections?$filter=ofm_is_published eq true and _ofm_survey_value eq '${req?.query?.surveyId}'&$orderby=ofm_section_order`
    const response = await getOperation(operation)
    response?.value?.forEach((section) => sections.push(new MappableObjectForFront(section, SurveySectionMappings).toJSON()))
    return res.status(HttpStatus.OK).json(sections)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getSurveyQuestions(req, res) {
  try {
    if (isEmpty(req?.query)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Query parameter is required' })
    }
    const questions = []
    let operation
    if (req?.query?.sectionId) {
      operation = `ofm_questions?$select=ofm_question_choice,ofm_question_id,ofm_question_text,ofm_question_type,ofm_sequence,ofm_fixed_response,_ofm_header_value,ofm_maximum_rows,ofm_response_required,ofm_occurence&$expand=ofm_question_business_rule_ques($select=_ofm_true_child_question_value,_ofm_false_child_question_value,ofm_question_business_ruleid,ofm_condition,ofm_parent_has_response,_ofm_child_question_value)&$filter=ofm_is_published eq true and _ofm_section_value eq '${req?.query?.sectionId}'&$orderby=ofm_sequence`
    }
    const response = await getOperation(operation)
    response?.value?.forEach((question) => questions.push(mapQuestionObjectForFront(question)))
    return res.status(HttpStatus.OK).json(questions)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getQuestionFixedResponses(req, res) {
  try {
    const response = await getOperation(req.body?.fixedResponseQuery)
    return res.status(HttpStatus.OK).json(mapFixedResponsesObjectForFront(req.body?.fixedResponseQuery, response.value))
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function createSurveyResponse(req, res) {
  try {
    const payload = {
      'ofm_contact@odata.bind': `/contacts(${req.body?.contactId})`,
      'ofm_facility@odata.bind': `/accounts(${req.body?.facilityId})`,
      'ofm_survey@odata.bind': `/ofm_surveies(${req.body?.surveyId})`,
      'ofm_fiscal_year@odata.bind': `/ofm_fiscal_years(${req.body?.fiscalYearId})`,
      'ofm_reporting_month@odata.bind': `/ofm_months(${req.body?.reportingMonthId})`,
      ofm_response_type: req.body?.surveyResponseType,
    }
    const response = await postOperation('ofm_survey_responses', payload)
    return res.status(HttpStatus.CREATED).json(new MappableObjectForFront(response, SurveyResponseMappings).toJSON())
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getSurveyResponse(req, res) {
  try {
    const operation = `ofm_survey_responses(${req?.params?.surveyResponseId})`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, SurveyResponseMappings))
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateSurveyResponse(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, SurveyResponseMappings).toJSON()
    // ofm_submitted_month field is a lookup field in CRM, so we need to replace them with data binding syntax
    if ('_ofm_submitted_month_value' in payload) {
      payload['ofm_submitted_month@odata.bind'] = `/ofm_months(${payload['_ofm_submitted_month_value']})`
      delete payload['_ofm_submitted_month_value']
    }
    const response = await patchOperationWithObjectId('ofm_survey_responses', req.params.surveyResponseId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getQuestionResponses(req, res) {
  try {
    if (isEmpty(req?.query)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Query parameter is required' })
    }
    const questionResponses = []
    let operation
    if (req?.query?.surveyResponseId) {
      operation = `ofm_question_responses?$select=ofm_question_responseid,_ofm_survey_response_value,_ofm_question_value,_ofm_header_value,ofm_row_id,ofm_response_text&$filter=_ofm_survey_response_value eq '${req?.query?.surveyResponseId}'&pageSize=5000`
    }
    const response = await getOperation(operation)
    response?.value?.forEach((questionResponse) => questionResponses.push(new MappableObjectForFront(questionResponse, QuestionResponseMappings).toJSON()))
    return res.status(HttpStatus.OK).json(questionResponses)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function createQuestionResponse(req, res) {
  try {
    const payload = {
      'ofm_question@odata.bind': `/ofm_questions(${req.body?.questionId})`,
      'ofm_survey_response@odata.bind': `/ofm_survey_responses(${req.body?.surveyResponseId})`,
      ofm_response_text: req.body?.value,
    }
    if ('tableQuestionId' in req.body) {
      payload['ofm_row_id'] = req.body?.rowId
      payload['ofm_header@odata.bind'] = `/ofm_questions(${req.body?.tableQuestionId})`
    }
    const response = await postOperation('ofm_question_responses', payload)
    return res.status(HttpStatus.CREATED).json(new MappableObjectForFront(response, QuestionResponseMappings).toJSON())
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateQuestionResponse(req, res) {
  try {
    const payload = {
      ofm_response_text: req.body?.value,
      ofm_row_id: req.body?.rowId,
    }
    const response = await patchOperationWithObjectId('ofm_question_responses', req.params.questionResponseId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function deleteQuestionResponse(req, res) {
  try {
    const response = await deleteOperationWithObjectId('ofm_question_responses', req.params.questionResponseId)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getFacilityReports,
  getSurveySections,
  getSurveyQuestions,
  getSurveyResponse,
  createSurveyResponse,
  updateSurveyResponse,
  getQuestionFixedResponses,
  getQuestionResponses,
  createQuestionResponse,
  updateQuestionResponse,
  deleteQuestionResponse,
}
