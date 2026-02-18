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

/**
 * The list of fixed percentage question columns. Each object contains the column the percentage column comes after
 * along with a calculator property that will reactively calculate the percentage based on related dependency columns.
 */
export const FIXED_PERCENTAGE_QUESTIONS = [
  {
    // Children under 36 months old
    comesAfter: 'QID56_3_1',
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === 'QID56_3_1')?.fixedResponse || 0
      const partTimeId = questions.find((q) => q.uniqueId === 'QID56_1_1')?.questionId
      const fullTimeId = questions.find((q) => q.uniqueId === 'QID56_2_1')?.questionId
      const partTimeEnrolment = (Number(responses.find((r) => r.questionId === partTimeId)?.value) || 0) / 2
      const fullTimeEnrolment = Number(responses.find((r) => r.questionId === fullTimeId)?.value) || 0
      return Math.round(((partTimeEnrolment + fullTimeEnrolment) / totalCapacity) * 100)
    },
  },
  {
    // 30 months to school age
    comesAfter: 'QID57_3_1',
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === 'QID57_3_1')?.fixedResponse || 0
      const partTimeId = questions.find((q) => q.uniqueId === 'QID57_1_1')?.questionId
      const fullTimeId = questions.find((q) => q.uniqueId === 'QID57_2_1')?.questionId
      const partTimeEnrolment = (Number(responses.find((r) => r.questionId === partTimeId)?.value) || 0) / 2
      const fullTimeEnrolment = Number(responses.find((r) => r.questionId === fullTimeId)?.value) || 0
      return Math.round(((partTimeEnrolment + fullTimeEnrolment) / totalCapacity) * 100)
    },
  },
  {
    // Preschool group 1
    comesAfter: 'QID60_2_1',
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === 'QID60_2_1')?.fixedResponse || 0
      const questionId = questions.find((q) => q.uniqueId === 'QID60_1_1')?.questionId
      const enrolment = Number(responses.find((r) => r.questionId === questionId).value)
      return Math.round((enrolment / totalCapacity) * 100)
    },
  },
  {
    // Preschool group 2
    comesAfter: 'QID61_2_1',
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === 'QID61_2_1')?.fixedResponse || 0
      const questionId = questions.find((q) => q.uniqueId === 'QID61_1_1')?.questionId
      const enrolment = Number(responses.find((r) => r.questionId === questionId).value)
      return Math.round((enrolment / totalCapacity) * 100)
    },
  },
  {
    // Preschool group 3
    comesAfter: 'QID62_2_1',
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === 'QID62_2_1')?.fixedResponse || 0
      const questionId = questions.find((q) => q.uniqueId === 'QID62_1_1')?.questionId
      const enrolment = Number(responses.find((r) => r.questionId === questionId).value)
      return Math.round((enrolment / totalCapacity) * 100)
    },
  },
  {
    // Preschool Group 4
    comesAfter: 'QID63_2_1',
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === 'QID63_2_1')?.fixedResponse || 0
      const questionId = questions.find((q) => q.uniqueId === 'QID63_1_1')?.questionId
      const enrolment = Number(responses.find((r) => r.questionId === questionId).value)
      return Math.round((enrolment / totalCapacity) * 100)
    },
  },
  {
    // Multi-age care
    comesAfter: 'QID69_3_1',
    calculator: (questions, responses) => {
      const totalCapacity = questions.find((q) => q.uniqueId === 'QID69_3_1')?.fixedResponse || 0
      const partTimeId = questions.find((q) => q.uniqueId === 'QID69_1_1')?.questionId
      const fullTimeId = questions.find((q) => q.uniqueId === 'QID69_2_1')?.questionId
      const partTimeEnrolment = (Number(responses.find((r) => r.questionId === partTimeId)?.value) || 0) / 2
      const fullTimeEnrolment = Number(responses.find((r) => r.questionId === fullTimeId)?.value) || 0
      return Math.round(((partTimeEnrolment + fullTimeEnrolment) / totalCapacity) * 100)
    },
  },
  {
    // Group school-age child care after school, but used to find the group school aged row
    // and calculate a consolidated percentage.
    // TODO: Verify if this question is still valid or not
    comesAfter: 'QID65_2_1',
    calculator: (questions, responses) => {
      const enrolmentQuestionIds = [questions.find((q) => q.uniqueId === 'QID64_1_1')?.questionId, questions.find((q) => q.uniqueId === 'QID65_1_1')?.questionId]
      const capacityQuestionIds = [questions.find((q) => q.uniqueId === 'QID64_2_1')?.questionId, questions.find((q) => q.uniqueId === 'QID65_2_1')?.questionId]
      const enrolment = enrolmentQuestionIds.reduce(toQuestionResponseSum(responses), 0)
      const totalCapacity = capacityQuestionIds.reduce(toFixedResponseSum(questions), 0)

      return Math.round((enrolment / totalCapacity) * 100)
    },
  },
]
