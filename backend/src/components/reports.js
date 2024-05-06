'use strict'
const { getOperation, postOperation, patchOperationWithObjectId, deleteOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { SurveySectionMappings, SurveyQuestionMappings, SurveyResponseMappings, QuestionResponseMappings, SurveyQuestionBusinessRulesMappings } = require('../util/mapping/Mappings')
const log = require('../components/logger')
const HttpStatus = require('http-status-codes')
const { isEmpty, orderBy } = require('lodash')
const { buildFilterQuery } = require('../util/common')

function mapQuestionObjectForFront(data) {
  const question = new MappableObjectForFront(data, SurveyQuestionMappings).toJSON()
  if (!isEmpty(question) && 'ofm_question_business_rule_ques' in data) {
    question.businessRules = []
    data['ofm_question_business_rule_ques']?.forEach((rule) => question?.businessRules.push(new MappableObjectForFront(rule, SurveyQuestionBusinessRulesMappings).toJSON()))
  }
  return question
}

function convertFixedResponseQuery(query, entityId) {
  if (isEmpty(query) || isEmpty(entityId)) return
  let updatedQuery = ''
  if (query?.includes('_ofm_facility_value eq {accountid}')) {
    updatedQuery = query?.replace('accountid', entityId)
  }
  return updatedQuery
}

/* Example of a fixed response query: "ofm_licence_details?$select=ofm_operational_spaces&$filter=ofm_licence_type eq 1 and (ofm_licence/_ofm_facility_value eq {accountid})"
   Note: There should be only 1 field in the select statement
*/
function mapFixedResponseObjectForFront(fixedResponseQuery, data) {
  const startString = '$select='
  const endString = '&$filter'
  const startIndex = fixedResponseQuery?.indexOf(startString) + startString.length
  const endIndex = fixedResponseQuery?.indexOf(endString)
  const selectedField = fixedResponseQuery?.substring(startIndex, endIndex)
  if (isEmpty(selectedField)) return
  let result = null
  data?.forEach((item) => {
    if (!result) {
      result = item[selectedField]
    } else {
      result += item[selectedField]
    }
  })
  return result
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
    let operation
    if (req?.query?.sectionId) {
      operation = `ofm_questions?$select=ofm_question_choice,ofm_question_id,ofm_question_text,ofm_question_type,ofm_sequence,ofm_fixed_response,_ofm_header_value,ofm_maximum_rows,ofm_response_required,ofm_occurence&$expand=ofm_question_business_rule_ques($select=_ofm_true_child_question_value,_ofm_false_child_question_value,ofm_question_business_ruleid,ofm_condition,ofm_parent_has_response,_ofm_child_question_value)&$filter=ofm_is_published eq true and _ofm_section_value eq '${req?.query?.sectionId}'`
    }
    const response = await getOperation(operation)
    let questions = []
    await Promise.all(
      response?.value?.map(async (item) => {
        const question = mapQuestionObjectForFront(item)
        if (!isEmpty(item['ofm_fixed_response'])) {
          question.fixedResponse = await getQuestionFixedResponse(item['ofm_fixed_response'], req?.query?.facilityId)
        }
        questions.push(question)
      }),
    )
    questions = orderBy(questions, 'sequence')
    return res.status(HttpStatus.OK).json(questions)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

/*
  Note: For now, we only allow facilityId in the query's filter. If we need to add more filters, we will need to update getSurveyQuestions and add new filters to convertFixedResponseQuery() function
*/
async function getQuestionFixedResponse(fixedResponseQuery, entityId) {
  try {
    const response = await getOperation(convertFixedResponseQuery(fixedResponseQuery, entityId))
    return mapFixedResponseObjectForFront(fixedResponseQuery, response.value)
  } catch (e) {
    log.error(`Failed to get question fixed responses - ${e}`)
    throw e
  }
}

async function getSurveyResponses(req, res) {
  try {
    if (isEmpty(req?.query)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Query parameter is required' })
    }
    const surveyResponses = []
    const operation = `ofm_survey_responses?$filter=(${buildFilterQuery(req?.query, SurveyResponseMappings)})`
    const response = await getOperation(operation)
    response?.value?.forEach((surveyResponse) => surveyResponses.push(new MappableObjectForFront(surveyResponse, SurveyResponseMappings).toJSON()))
    if (isEmpty(surveyResponses)) {
      return res.status(HttpStatus.NO_CONTENT).json()
    }
    return res.status(HttpStatus.OK).json(surveyResponses)
  } catch (e) {
    log.error(e)
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
      ofm_name: req.body?.surveyResponseTitle,
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
  getSurveySections,
  getSurveyQuestions,
  getSurveyResponse,
  getSurveyResponses,
  createSurveyResponse,
  updateSurveyResponse,
  getQuestionResponses,
  createQuestionResponse,
  updateQuestionResponse,
  deleteQuestionResponse,
}
