<template>
  <v-container fluid class="pa-0 ma-0">
    <v-data-table :headers="tableHeaders" :items="updatedResponses" item-value="name" items-per-page="-1">
      <template v-slot:item="{ item }">
        <tr>
          <td v-for="question in questions" :key="question?.questionId" class="" :class="readonly ? 'py-4' : 'pt-4'">
            <SurveyQuestion :question="question" :response="getQuestionResponse(item, question?.questionId)" :validation="false" :readonly="readonly" @update="updateResponses" />
          </td>
          <td v-if="!readonly && !hasValueInheritanceChildQuestions && updatedResponses?.length > 1">
            <v-btn variant="text" @click="deleteResponse(item, question?.questionId)">
              <v-icon icon="fa:fa-regular fa-trash-can"></v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:bottom><!-- no paging --></template>
    </v-data-table>
    <div v-if="validation && required && isTableEmpty" class="error-message mt-2">This field is required</div>
    <AppButton v-if="showAddButton" id="add-button" class="mt-4 mb-12" :primary="false" size="large" width="125px" @click="addRow">Add Row</AppButton>
  </v-container>
</template>

<script>
import reportMixin from '@/mixins/reportMixin'
import AppButton from '@/components/ui/AppButton.vue'
import SurveyQuestion from '@/components/reports/SurveyQuestion.vue'
import { isEmpty } from 'lodash'

export default {
  components: { AppButton, SurveyQuestion },
  mixins: [reportMixin],
  props: {
    questions: {
      type: Array,
      default: () => [],
    },
    responses: {
      type: Array,
      default: () => [],
    },
    maxRows: {
      type: Number,
      default: 0,
    },
    readonly: {
      type: Boolean,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    validation: {
      type: Boolean,
      default: false,
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
      if (!this.hasValueInheritanceChildQuestions) {
        headers.push({ title: '', key: 'actionButtons', sortable: false, width: '3%' })
      }
      return headers
    },

    responsesInTableFormat() {
      if (isEmpty(this.responses)) return
      const responses = []
      let index = 0
      let rowResponses = this.responses?.filter((item) => !this.isHiddenOrDeleted(item) && item.rowId === index)
      while (!isEmpty(rowResponses)) {
        const row = {
          rowId: rowResponses[0].rowId,
          tableQuestionId: this.tableQuestionId,
          headers: {},
        }
        this.questions?.forEach((question) => {
          const cell = rowResponses.find((item) => item.questionId === question.questionId)
          row.headers[question.questionId] = cell?.value
        })
        responses.push(row)
        index += 1
        rowResponses = this.responses?.filter((item) => !this.isHiddenOrDeleted(item) && item.rowId === index)
      }
      return responses
    },

    hasValueInheritanceChildQuestions() {
      return this.questions?.some((question) => 'inheritanceValues' in question)
    },

    valueInheritanceParentsQuestion() {
      return this.questions?.find((question) => !isEmpty(question?.businessRules))
    },

    isMaxRowsReached() {
      return this.updatedResponses?.length >= this.maxRows
    },

    isTableEmpty() {
      return this.updatedResponses?.every((row) => this.isRowBlank(row?.headers))
    },

    showAddButton() {
      return !this.readonly && !this.isMaxRowsReached && !this.hasValueInheritanceChildQuestions
    },
  },

  watch: {
    responses: {
      handler() {
        this.updatedResponses = this.responsesInTableFormat
        if (isEmpty(this.updatedResponses)) {
          this.addRow()
        }
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
    /*
      1. If a table is the parents/child table of a value inheritance rule:
        - For the parents table, the users can add a new row to the parents table if they have entered value to the parent column of the previous row (e.g.: Initials).
        - For the child table, since it inherits values from the parents table, the "Add Row" button is hidden.
      2. If a table is NOT the parents/child table of a value inheritance rule:
        - The users can add a new row to the table if they have entered any value in the previous row
    */
    addRow() {
      if (!isEmpty(this.updatedResponses)) {
        const lastIndex = this.updatedResponses?.length - 1
        if (
          this.isRowBlank(this.updatedResponses[lastIndex]?.headers) ||
          (!isEmpty(this.valueInheritanceParentsQuestion) && isEmpty(this.updatedResponses[lastIndex]?.headers[this.valueInheritanceParentsQuestion?.questionId]))
        )
          return
      }
      this.updatedResponses = this.updatedResponses ?? []
      const row = {
        rowId: this.updatedResponses?.length ?? 0,
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
      if (isEmpty(row?.questionResponseId) && this.isRowBlank(row?.headers)) {
        const index = this.updatedResponses?.findIndex((item) => item.rowId === row.rowId)
        if (index > -1) {
          this.updatedResponses.splice(index, 1)
        }
      }
      this.$emit('delete', row)
    },

    isRowBlank(row) {
      let isBlank = true
      for (const header in row) {
        isBlank = isBlank && isEmpty(row[header])
      }
      return isBlank
    },
  },
}
</script>
<style scoped>
.error-message {
  font-size: 12px;
}
</style>
