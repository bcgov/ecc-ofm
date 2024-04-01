<template>
  <v-container fluid class="pa-0 ma-0">
    <v-data-table :headers="tableHeaders" :items="updatedResponses" item-value="name" items-per-page="-1">
      <template v-slot:item="{ item }">
        <tr>
          <td v-for="question in questions" :key="question?.questionId">
            <SurveyQuestion :question="question" :response="getQuestionResponse(item, question?.questionId)" @update="updateResponses" />
          </td>
          <td v-if="!hasInheritedValueQuestion && updatedResponses?.length > 1">
            <v-btn variant="text" @click="deleteResponse(item, question?.questionId)">
              <v-icon icon="fa:fa-regular fa-trash-can"></v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:bottom><!-- no paging --></template>
    </v-data-table>
    <AppButton v-if="!isMaxRowsReached && !hasInheritedValueQuestion" id="apply-button" class="mt-4 mb-12" :primary="false" size="large" width="125px" @click="addRow">Add Row</AppButton>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import SurveyQuestion from '@/components/reports/SurveyQuestion.vue'
import { isEmpty } from 'lodash'

export default {
  components: { AppButton, SurveyQuestion },

  props: {
    maxRows: {
      type: Number,
      default: 0,
    },
    questions: {
      type: Array,
      default: () => [],
    },
    responses: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['update', 'delete'],

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
      const headers = this.questions?.map((header) => {
        return {
          title: header.text,
          key: header.questionId,
          sortable: false,
        }
      })
      if (!this.hasInheritedValueQuestion) {
        headers.push({ title: '', key: 'actionButtons', sortable: false, width: '3%' })
      }
      return headers
    },

    responsesInTableFormat() {
      console.log('responsesInTableFormat')
      console.log(this.responses)
      if (isEmpty(this.responses)) return
      const responses = []
      let index = 0
      let rowResponse = this.responses?.filter((item) => !item.hide && item.rowId === index)
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
        if (!isEmpty(row)) {
          responses.push(row)
        }
        index += 1
        rowResponse = this.responses?.filter((item) => !item.hide && item.rowId === index)
      }
      return responses
    },

    hasInheritedValueQuestion() {
      return this.questions?.some((question) => !isEmpty(question.inheritedValues))
    },

    isMaxRowsReached() {
      return this.updatedResponses?.length >= this.maxRows
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
      this.$emit('update', response)
    },

    deleteResponse(row) {
      console.log('delete')
      console.log(row)
      console.log(this.updatedResponses)
      const index = this.updatedResponses?.findIndex((item) => item.rowId === row?.rowId)
      if (index > -1) {
        this.updatedResponses.splice(index, 1)
      }

      this.$emit('delete', row)
    },
  },
}
</script>
