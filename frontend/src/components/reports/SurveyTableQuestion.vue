<template>
  <v-container fluid class="pa-0 ma-0">
    <v-data-table :headers="tableHeaders" :items="updatedResponses" item-value="name" items-per-page="-1">
      <template v-slot:item="{ item }">
        <tr>
          <td v-for="question in questions" :key="question?.questionId">
            <SurveyQuestion :question="question" :response="getQuestionResponse(item, question?.questionId)" @update="updateResponses" />
          </td>
        </tr>
      </template>
      <template v-slot:bottom><!-- no paging --></template>
    </v-data-table>
    <AppButton id="apply-button" class="mt-4 mb-12" :primary="false" size="large" width="125px" @click="addRow">Add Row</AppButton>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import SurveyQuestion from '@/components/reports/SurveyQuestion.vue'
import { isEmpty } from 'lodash'

export default {
  components: { AppButton, SurveyQuestion },

  props: {
    questions: {
      type: Array,
      default: () => [],
    },
    responses: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['update'],

  data() {
    return {
      updatedResponses: [],
    }
  },

  computed: {
    tableQuestionId() {
      return this.questions[0]?.tableQuestionId
    },

    tableHeaders() {
      return this.questions?.map((header) => {
        return {
          title: header.text,
          key: header.questionId,
          sortable: false,
        }
      })
    },

    responsesInTableFormat() {
      if (isEmpty(this.responses)) return
      const responses = []
      let index = 0
      let rowResponse = this.responses?.filter((item) => item.rowId === index)
      while (!isEmpty(rowResponse)) {
        const row = {
          rowId: rowResponse[0].rowId,
          tableQuestionId: this.tableQuestionId,
          headers: {},
        }
        this.questions?.forEach((question) => {
          const cell = rowResponse.find((item) => item.questionId === question.questionId)
          row.headers[question.questionId] = cell?.value
        })
        responses.push(row)
        index += 1
        rowResponse = this.responses?.filter((item) => item.rowId === index)
      }
      console.log('responsesInTableFormat')
      console.log(responses)

      return responses
    },
  },

  watch: {
    responsesInTableFormat: {
      handler() {
        this.updatedResponses = this.responsesInTableFormat
      },
      deep: true,
    },
  },

  created() {
    if (isEmpty(this.responses)) {
      this.addRow()
    } else {
      this.updatedResponses = this.responsesInTableFormat
    }
  },

  methods: {
    addRow() {
      const row = {
        rowId: this.updatedResponses?.length,
        tableQuestionId: this.tableQuestionId,
        headers: {},
      }
      this.questions.forEach((question) => (row.headers[question.questionId] = undefined))
      this.updatedResponses?.push(row)
      console.log(this.updatedResponses)
    },

    getQuestionResponse(row, questionId) {
      const response = this.updatedResponses?.find((item) => item.rowId === row?.rowId)
      return {
        rowId: row?.rowId,
        tableQuestionId: this.tableQuestionId,
        value: response?.headers[questionId],
      }
    },

    updateResponses(response) {
      this.updatedResponses[response?.rowId].headers[response?.questionId] = response?.value
      this.$emit('update', response)
    },
  },
}
</script>
