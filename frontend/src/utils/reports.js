import { isFunction } from 'lodash'
import { FIXED_PERCENTAGE_QUESTIONS } from './constants/reports'

/**
 * A reducer for converting an ordinal array of questions into questions with pre-determined calculated percentage
 * columns.
 */
export function toEnrolmentQuestionsWithPercentages(questions, currentQuestion) {
  const calculatorFunction = FIXED_PERCENTAGE_QUESTIONS.find((q) => q.comesAfter === currentQuestion.uniqueId)?.calculator

  if (isFunction(calculatorFunction)) {
    const { tableQuestionId, uniqueId } = currentQuestion
    return [
      ...questions,
      currentQuestion,
      {
        questionId: `${uniqueId}-percent`,
        text: 'Percentage',
        type: 'Percent',
        fixedResponse: true,
        responseRequired: false,
        tableQuestionId,
        calculator: calculatorFunction,
      },
    ]
  }

  return [...questions, currentQuestion]
}
