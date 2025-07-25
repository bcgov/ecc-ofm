'use strict'
const { getOperation, postBatches, postOperation, patchOperationWithObjectId, deleteOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { SurveySectionMappings, SurveyQuestionMappings, SurveyResponseMappings, QuestionResponseMappings, SurveyQuestionBusinessRulesMappings } = require('../util/mapping/Mappings')
const log = require('../components/logger')
const HttpStatus = require('http-status-codes')
const { isEmpty, orderBy } = require('lodash')
const { buildDateFilterQuery, buildFilterQuery } = require('../util/common')
const { SURVEY_RESPONSE_STATUS_CODES } = require('../util/constants')

function mapQuestionObjectForFront(data) {
  const question = new MappableObjectForFront(data, SurveyQuestionMappings).toJSON()
  if (!isEmpty(question) && 'ofm_ofm_question_ofm_question_business_rule_parentquestionid' in data) {
    question.businessRules = []
    data['ofm_ofm_question_ofm_question_business_rule_parentquestionid']?.forEach((rule) =>
      question?.businessRules.push(new MappableObjectForFront(rule, SurveyQuestionBusinessRulesMappings).toJSON()),
    )
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
    const sections = []
    const operation = `ofm_sections?$filter=_ofm_survey_value eq '${req?.query?.surveyTemplateId}'&$orderby=ofm_section_order`
    const response = await getOperation(operation)
    response?.value?.forEach((section) => sections.push(new MappableObjectForFront(section, SurveySectionMappings).toJSON()))
    return res.status(HttpStatus.OK).json(sections)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getSurveyQuestions(req, res) {
  try {
    let operation
    if (req?.query?.sectionId) {
      operation = `ofm_questions?$select=ofm_question_choice,ofm_question_id,ofm_question_text,ofm_question_type,ofm_response_required,ofm_sequence,ofm_fixed_response,_ofm_header_value,ofm_maximum_rows,ofm_additional_info&$expand=ofm_ofm_question_ofm_question_business_rule_parentquestionid($select=_ofm_child_question_value,ofm_condition,_ofm_false_child_question_value,ofm_parent_has_response,_ofm_parentquestionid_value,ofm_question_business_ruleid,_ofm_true_child_question_value)&$filter=_ofm_section_value eq '${req?.query?.sectionId}'`
    }
    const response = await getOperation(operation)
    let questions = []
    await Promise.all(
      response?.value?.map(async (item) => {
        const question = mapQuestionObjectForFront(item)
        if (!isEmpty(item['ofm_fixed_response']) && item['ofm_fixed_response'] !== 'N/A') {
          question.fixedResponse = await getQuestionFixedResponse(item['ofm_fixed_response'], req?.query?.facilityId)
        }
        questions.push(question)
      }),
    )
    questions = orderBy(questions, 'sequence')
    return res.status(HttpStatus.OK).json(questions)
  } catch (e) {
    log.error(e)
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
    const surveyResponses = []
    let filter = `${buildDateFilterQuery(req?.query, 'ofm_submitted_on')}${buildFilterQuery(req?.query, SurveyResponseMappings)} and statuscode ne ${SURVEY_RESPONSE_STATUS_CODES.INACTIVE}`
    if (req.query?.isSubmitted != null) {
      filter += req.query?.isSubmitted === 'true' ? ' and _ofm_contact_value ne null' : ' and _ofm_contact_value eq null'
    }
    const operation = `ofm_survey_responses?$filter=(${filter})&pageSize=500`
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

async function getSurveyResponsesCount(req, res) {
  try {
    let filter = `${buildDateFilterQuery(req?.query, 'ofm_submitted_on')}${buildFilterQuery(req?.query, SurveyResponseMappings)} and statuscode ne ${SURVEY_RESPONSE_STATUS_CODES.INACTIVE}`
    if (req.query?.isSubmitted != null) {
      filter += req.query?.isSubmitted === 'true' ? ' and _ofm_contact_value ne null' : ' and _ofm_contact_value eq null'
    }
    const operation = `ofm_survey_responses?$filter=(${filter})&$apply=aggregate($count as count)`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(response?.value)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getSurveyResponse(req, res) {
  try {
    const operation = `ofm_survey_responses(${req?.params?.surveyResponseId})`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, SurveyResponseMappings))
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateSurveyResponse(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, SurveyResponseMappings).toJSON()
    // ofm_contact field is a lookup field in CRM, so we need to replace them with data binding syntax
    if ('_ofm_contact_value' in payload) {
      payload['ofm_contact@odata.bind'] = payload['_ofm_contact_value'] ? `/contacts(${payload['_ofm_contact_value']})` : null
      delete payload['_ofm_contact_value']
    }
    const response = await patchOperationWithObjectId('ofm_survey_responses', req.params.surveyResponseId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function deleteSurveyResponse(req, res) {
  try {
    const payload = {
      batchTypeId: 102,
      feature: 'ReportManagement',
      function: 'ReportEdit',
      actionMode: 'Delete',
      scope: 'Parent-Child',
      data: {
        ofm_survey_response: {
          entityNameSet: 'ofm_survey_responses',
          entityID: req.params?.surveyResponseId,
          actionMode: 'Delete',
        },
      },
    }
    const response = await postBatches(payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getQuestionResponses(req, res) {
  try {
    const questionResponses = {}
    await Promise.all(
      req.body?.sectionIds?.map(async (sectionId) => {
        const response = await getOperation(
          `ofm_question_responses?$select=ofm_question_responseid,_ofm_survey_response_value,_ofm_question_value,_ofm_header_value,ofm_row_id,ofm_response_text&$filter=(_ofm_survey_response_value eq '${req?.body?.surveyResponseId}') and (ofm_question/_ofm_section_value eq '${sectionId}')&pageSize=5000`,
        )
        questionResponses[sectionId] = response?.value?.map((questionResponse) => new MappableObjectForFront(questionResponse, QuestionResponseMappings).toJSON())
      }),
    )
    return res.status(HttpStatus.OK).json(questionResponses)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function createQuestionResponses(req, res) {
  try {
    await Promise.all(
      req.body?.map(async (response) => {
        const payload = {
          'ofm_question@odata.bind': `/ofm_questions(${response?.questionId})`,
          'ofm_survey_response@odata.bind': `/ofm_survey_responses(${response?.surveyResponseId})`,
          ofm_response_text: response?.value,
        }
        if ('tableQuestionId' in response) {
          payload['ofm_row_id'] = response?.rowId
          payload['ofm_header@odata.bind'] = `/ofm_questions(${response?.tableQuestionId})`
        }
        await postOperation('ofm_question_responses', payload)
      }),
    )
    return res.status(HttpStatus.CREATED).json()
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateQuestionResponses(req, res) {
  try {
    await Promise.all(
      req.body?.map(async (response) => {
        const payload = {
          ofm_response_text: response.value,
          ofm_row_id: response.rowId,
        }
        await patchOperationWithObjectId('ofm_question_responses', response.questionResponseId, payload)
      }),
    )
    return res.status(HttpStatus.OK).json()
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}
async function deleteQuestionResponses(req, res) {
  try {
    await Promise.all(
      req.body?.map(async (responseId) => {
        await deleteOperationWithObjectId('ofm_question_responses', responseId)
      }),
    )
    return res.status(HttpStatus.OK).json()
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getSurveySections,
  getSurveyQuestions,
  getSurveyResponse,
  getSurveyResponses,
  getSurveyResponsesCount,
  updateSurveyResponse,
  deleteSurveyResponse,
  getQuestionResponses,
  createQuestionResponses,
  updateQuestionResponses,
  deleteQuestionResponses,
}
