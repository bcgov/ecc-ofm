<template>
  <v-container fluid class="pa-0 ma-0">
    <v-data-table :headers="getHeaders" :items="updatedResponses" item-value="name">
      <template v-slot:item="{ item }">
        <tr>
          <td v-for="questionId in Object.keys(item.value)" :key="questionId">
            <SurveyQuestion :question="getQuestion(questionId)" :response="getQuestionResponse(item, questionId)" @update="updateResponses" />
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
    question: {
      type: Object,
      default: () => {
        return {}
      },
    },
    response: {
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
    getHeaders() {
      console.log('HEADER')
      console.log(this.question?.headers)
      return this.question?.headers?.map((header) => {
        return {
          title: header.text,
          key: header.questionId,
          sortable: false,
        }
      })
    },
  },

  created() {
    console.log('CREATED')
    console.log(this.response)
    this.cloneOriginalResponses()
    if (isEmpty(this.updatedResponses)) {
      this.addRow()
    }
  },

  methods: {
    getQuestion(questionId) {
      return this.question?.headers?.find((item) => item.questionId === questionId)
    },

    cloneOriginalResponses() {
      if (isEmpty(this.response)) return
      let index = 0
      let found = this.response?.filter((item) => item.rowId === index)
      // console.log(found)
      while (!isEmpty(found)) {
        const rowId = found[0].rowId
        const tableQuestionId = found[0].tableQuestionId
        const row = {
          rowId: rowId,
          tableQuestionId: tableQuestionId,
          value: {},
        }
        this.question?.headers?.forEach((header) => {
          const temp = found.find((item) => item.questionId === header.questionId)
          row.value[header.questionId] = temp?.value
        })
        this.updatedResponses.push(row)
        index += 1
        found = this.response?.filter((item) => item.rowId === index)
      }
      // console.log('CREATEDDDDDDDDDDDDDDDDDDDDD')
      // console.log(this.updatedResponses)
    },

    addRow() {
      const row = {
        rowId: this.updatedResponses?.length,
        tableQuestionId: this.question?.questionId,
        value: {},
      }
      this.question?.headers?.forEach((header) => (row.value[header.questionId] = undefined))
      this.updatedResponses.push(row)
      console.log(this.updatedResponses)
    },

    getQuestionResponse(row, questionId) {
      const response = this.updatedResponses?.find((item) => item.rowId === row?.rowId)
      // console.log(foundRow)
      // console.log(header)
      // console.log(foundRow?.value[questionId])
      // console.log('getQuestionResponse')
      // console.log(questionId)
      // console.log(response)
      return {
        rowId: row?.rowId,
        tableQuestionId: row?.tableQuestionId,
        value: response?.value[questionId],
      }
    },

    updateResponses(response) {
      this.$emit('update', response)
    },
  },
}
</script>
