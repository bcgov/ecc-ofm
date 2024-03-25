<template>
  <v-container fluid class="pa-2 pb-0">
    <div class="mt-4">
      <h4 class="text-decoration-underline">Funding Selected</h4>
      <ul>
        <li v-for="item in selectedFunding" :key="item.value" class="ml-8 my-2">
          {{ item.label }}
        </li>
      </ul>
    </div>

    <div v-if="isOtherBoxDisplayed">
      <p v-if="indigenousProgrammingModel.indigenousOtherDescription" class="ml-12 my-2">
        {{ indigenousProgrammingModel.indigenousOtherDescription }}
      </p>
      <p v-else>
        <AppMissingInfoError :to="{ name: 'supp-allowances-form', params: { applicationGuid: $route.params.applicationGuid } }">
          {{ APPLICATION_ERROR_MESSAGES.OTHER }}
        </AppMissingInfoError>
      </p>
    </div>
    <!-- <AppMissingInfoError v-else :to="{ name: 'supp-allowances-form', hash: '#', params: { applicationGuid: $route.params.applicationGuid } }">ERROR!!</AppMissingInfoError> -->
  </v-container>
</template>

<script>
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import { APPLICATION_ERROR_MESSAGES } from '@/utils/constants'
import { INDIG_CHECKBOX_LABELS } from './suppConstants'

export default {
  components: { AppMissingInfoError },
  props: {
    indigenousProgrammingModel: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    selectedFunding() {
      return this.INDIG_CHECKBOX_LABELS.filter((item) => this.indigenousProgrammingModel.indigenousFundingModel.includes(item.value))
    },
    isOtherBoxDisplayed() {
      return this.indigenousProgrammingModel.indigenousFundingModel.includes(this.INDIG_CHECKBOX_LABELS.find((item) => item.label === 'Other').value)
    },
  },
  created() {
    this.INDIG_CHECKBOX_LABELS = INDIG_CHECKBOX_LABELS
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
  },
  methods: {},
}
</script>
