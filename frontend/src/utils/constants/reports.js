import { isNumber } from 'lodash'

function toQuestionResponseSum(responses) {
  return (total, currentId) => {
    const response = Number(responses.find((r) => r.questionId === currentId)?.value)
    if (isNumber(response)) {
      return total + response
    }
    return total
  }
}

function toFixedResponseSum(questions) {
  return (total, currentId) => {
    const response = Number(questions.find((r) => r.questionId === currentId)?.fixedResponse)
    if (isNumber(response)) {
      return total + response
    }
    return total
  }
}

export const REPORT_SECTION_TITLES = Object.freeze({
  HUMAN_RESOURCES: 'Human Resources',
  ENROLMENT: 'Enrolment',
  UNDER_ENROLMENT: 'Under Enrolment',
  OVERALL_FUNDING: 'Overall Funding',
})

/**
 * QuestionIDS, a cross environment way to identify which abstract questions are which.
 */
export const QIDS = {
  UNDER_ENROLMENT: 'QID47',
  UNDER_36_MONTHS_TOTAL_CAPACITY: 'QID56_3_1',
  UNDER_36_MONTHS_PART_TIME: 'QID56_1_1',
  UNDER_36_MONTHS_FULL_TIME: 'QID56_2_1',
  THIRTY_MONTHS_TO_SCHOOL_TOTAL_CAPACITY: 'QID57_3_1',
  THIRTY_MONTHS_TO_SCHOOL_PART_TIME: 'QID57_1_1',
  THIRTY_MONTHS_TO_SCHOOL_FULL_TIME: 'QID57_2_1',
  PRESCHOOL_GROUP_ONE_TOTAL_CAPACITY: 'QID60_2_1',
  PRESCHOOL_GROUP_ONE: 'QID60_1_1',
  PRESCHOOL_GROUP_TWO_TOTAL_CAPACITY: 'QID61_2_1',
  PRESCHOOL_GROUP_TWO: 'QID61_1_1',
  PRESCHOOL_GROUP_THREE_TOTAL_CAPACITY: 'QID62_2_1',
  PRESCHOOL_GROUP_THREE: 'QID62_1_1',
  PRESCHOOL_GROUP_FOUR_TOTAL_CAPACITY: 'QID63_2_1',
  PRESCHOOL_GROUP_FOUR: 'QID63_1_1',
  MULTI_AGE_TOTAL_CAPACITY: 'QID69_3_1',
  MULTI_AGE_PART_TIME: 'QID69_1_1',
  MULTI_AGE_FULL_TIME: 'QID69_2_1',
  SCHOOL_AGE_BEFORE_SCHOOL: 'QID64_1_1',
  SCHOOL_AGE_BEFORE_SCHOOL_TOTAL_CAPACITY: 'QID64_2_1',
  SCHOOL_AGE_AFTER_SCHOOL: 'QID65_1_1',
  SCHOOL_AGE_AFTER_SCHOOL_TOTAL_CAPACITY: 'QID65_2_1',
}

/**
 * The list of fixed percentage question columns. Each object contains the column the percentage column comes after
 * along with a calculator property that will reactively calculate the percentage based on related dependency columns.
 */
export const FIXED_PERCENTAGE_QUESTIONS = [
  {
    comesAfter: QIDS.UNDER_36_MONTHS_TOTAL_CAPACITY,
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === QIDS.UNDER_36_MONTHS_TOTAL_CAPACITY)?.fixedResponse || 0
      const partTimeId = questions.find((q) => q.uniqueId === QIDS.UNDER_36_MONTHS_PART_TIME)?.questionId
      const fullTimeId = questions.find((q) => q.uniqueId === QIDS.UNDER_36_MONTHS_FULL_TIME)?.questionId
      const partTimeEnrolment = (Number(responses.find((r) => r.questionId === partTimeId)?.value) || 0) / 2
      const fullTimeEnrolment = Number(responses.find((r) => r.questionId === fullTimeId)?.value) || 0
      return Math.round(((partTimeEnrolment + fullTimeEnrolment) / totalCapacity) * 100)
    },
  },
  {
    comesAfter: QIDS.THIRTY_MONTHS_TO_SCHOOL_TOTAL_CAPACITY,
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === QIDS.THIRTY_MONTHS_TO_SCHOOL_TOTAL_CAPACITY)?.fixedResponse || 0
      const partTimeId = questions.find((q) => q.uniqueId === QIDS.THIRTY_MONTHS_TO_SCHOOL_PART_TIME)?.questionId
      const fullTimeId = questions.find((q) => q.uniqueId === QIDS.THIRTY_MONTHS_TO_SCHOOL_FULL_TIME)?.questionId
      const partTimeEnrolment = (Number(responses.find((r) => r.questionId === partTimeId)?.value) || 0) / 2
      const fullTimeEnrolment = Number(responses.find((r) => r.questionId === fullTimeId)?.value) || 0
      return Math.round(((partTimeEnrolment + fullTimeEnrolment) / totalCapacity) * 100)
    },
  },
  {
    comesAfter: QIDS.PRESCHOOL_GROUP_ONE_TOTAL_CAPACITY,
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === QIDS.PRESCHOOL_GROUP_ONE_TOTAL_CAPACITY)?.fixedResponse || 0
      const questionId = questions.find((q) => q.uniqueId === QIDS.PRESCHOOL_GROUP_ONE)?.questionId
      const enrolment = Number(responses.find((r) => r.questionId === questionId).value) || 0
      return Math.round((enrolment / totalCapacity) * 100)
    },
  },
  {
    comesAfter: QIDS.PRESCHOOL_GROUP_TWO_TOTAL_CAPACITY,
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === QIDS.PRESCHOOL_GROUP_TWO_TOTAL_CAPACITY)?.fixedResponse || 0
      const questionId = questions.find((q) => q.uniqueId === QIDS.PRESCHOOL_GROUP_TWO)?.questionId
      const enrolment = Number(responses.find((r) => r.questionId === questionId).value) || 0
      return Math.round((enrolment / totalCapacity) * 100)
    },
  },
  {
    comesAfter: QIDS.PRESCHOOL_GROUP_THREE_TOTAL_CAPACITY,
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === QIDS.PRESCHOOL_GROUP_THREE_TOTAL_CAPACITY)?.fixedResponse || 0
      const questionId = questions.find((q) => q.uniqueId === QIDS.PRESCHOOL_GROUP_THREE)?.questionId
      const enrolment = Number(responses.find((r) => r.questionId === questionId).value) || 0
      return Math.round((enrolment / totalCapacity) * 100)
    },
  },
  {
    comesAfter: QIDS.PRESCHOOL_GROUP_FOUR_TOTAL_CAPACITY,
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === QIDS.PRESCHOOL_GROUP_FOUR_TOTAL_CAPACITY)?.fixedResponse || 0
      const questionId = questions.find((q) => q.uniqueId === QIDS.PRESCHOOL_GROUP_FOUR)?.questionId
      const enrolment = Number(responses.find((r) => r.questionId === questionId).value) || 0
      return Math.round((enrolment / totalCapacity) * 100)
    },
  },
  {
    comesAfter: QIDS.MULTI_AGE_TOTAL_CAPACITY,
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === QIDS.MULTI_AGE_TOTAL_CAPACITY)?.fixedResponse || 0
      const partTimeId = questions.find((q) => q.uniqueId === QIDS.MULTI_AGE_PART_TIME)?.questionId
      const fullTimeId = questions.find((q) => q.uniqueId === QIDS.MULTI_AGE_FULL_TIME)?.questionId
      const partTimeEnrolment = (Number(responses.find((r) => r.questionId === partTimeId)?.value) || 0) / 2
      const fullTimeEnrolment = Number(responses.find((r) => r.questionId === fullTimeId)?.value) || 0
      return Math.round(((partTimeEnrolment + fullTimeEnrolment) / totalCapacity) * 100)
    },
  },
  {
    // Group school-age child care after school, but used to find the group school aged row
    // and calculate a consolidated percentage.
    // TODO: Verify if this question is still valid or not
    comesAfter: QIDS.SCHOOL_AGE_AFTER_SCHOOL_TOTAL_CAPACITY,
    calculator: (questions, responses) => {
      const enrolmentQuestionIds = [questions.find((q) => q.uniqueId === QIDS.SCHOOL_AGE_BEFORE_SCHOOL)?.questionId, questions.find((q) => q.uniqueId === QIDS.SCHOOL_AGE_AFTER_SCHOOL)?.questionId]
      const capacityQuestionIds = [
        questions.find((q) => q.uniqueId === QIDS.SCHOOL_AGE_BEFORE_SCHOOL_TOTAL_CAPACITY)?.questionId,
        questions.find((q) => q.uniqueId === QIDS.SCHOOL_AGE_AFTER_SCHOOL_TOTAL_CAPACITY)?.questionId,
      ]
      const enrolment = enrolmentQuestionIds.reduce(toQuestionResponseSum(responses), 0)
      const totalCapacity = capacityQuestionIds.reduce(toFixedResponseSum(questions), 0)

      return Math.round((enrolment / totalCapacity) * 100)
    },
  },
]
