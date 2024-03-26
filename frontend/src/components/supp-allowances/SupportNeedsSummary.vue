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
      <p v-if="supportModel.supportOtherDescription" class="ml-12 my-2">
        {{ supportModel.supportOtherDescription }}
      </p>
      <p v-else>
        <AppMissingInfoError :to="{ name: 'supp-allowances-form', params: { applicationGuid: $route.params.applicationGuid } }">
          {{ APPLICATION_ERROR_MESSAGES.SUPP_OTHER }}
        </AppMissingInfoError>
      </p>
    </div>
  </v-container>
</template>

<script>
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import { APPLICATION_ERROR_MESSAGES } from '@/utils/constants'
import { SUPPORT_CHECKBOX_LABELS } from './suppConstants'

export default {
  components: { AppMissingInfoError },
  props: {
    supportModel: {
      type: Object,
      default: () => {
        return {}
      },
      required: true,
    },
  },
  computed: {
    selectedFunding() {
      return this.SUPPORT_CHECKBOX_LABELS.filter((item) => this.supportModel.supportFundingModel.includes(item.value))
    },
    isOtherBoxDisplayed() {
      return this.supportModel.supportFundingModel.includes(this.SUPPORT_CHECKBOX_LABELS.find((item) => item.label === 'Other').value)
    },
  },
  created() {
    this.SUPPORT_CHECKBOX_LABELS = SUPPORT_CHECKBOX_LABELS
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
  },
  methods: {},
}
</script>
