<template>
  <v-card v-for="model in supportModels" :key="model.supplementaryApplicationId ? model.supplementaryApplicationId : model.id" fluid class="pb-0 my-5">
    <AppAlertBanner v-if="model.isNextTerm" type="info">This Allowance application is for next year</AppAlertBanner>
    <AppAlertBanner v-if="!hasInclusionPolicy" type="warning">
      You must have an inclusion policy to apply for Support Needs Allowance. Your organization account manager can update inclusion policy details in
      <router-link :to="{ name: 'manage-organization' }">Account Management.</router-link>
    </AppAlertBanner>
    <div class="px-5">
      <div class="mt-2">
        <h4 class="text-decoration-underline">Funding Selected</h4>
        <ul>
          <li v-for="item in selectedFunding(model)" :key="item.value" class="ml-8 my-2">
            {{ item.label }}
          </li>
        </ul>
      </div>

      <div v-if="isOtherBoxDisplayed(model)">
        <p v-if="model.supportOtherDescription" class="ml-12 my-2">
          {{ model.supportOtherDescription }}
        </p>
        <p v-else>
          <AppMissingInfoError :to="{ name: 'supp-allowances-form', params: { applicationGuid: $route.params.applicationGuid }, query: { nextTerm: model.isNextTerm } }">
            {{ APPLICATION_ERROR_MESSAGES.SUPP_OTHER }}
          </AppMissingInfoError>
        </p>
      </div>
    </div>
  </v-card>
</template>

<script>
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import { APPLICATION_ERROR_MESSAGES } from '@/utils/constants'
import { SUPPORT_CHECKBOX_LABELS } from '@/utils/constants/suppConstants'

export default {
  components: { AppAlertBanner, AppMissingInfoError },
  props: {
    supportModels: {
      type: Array,
      default: () => {
        return []
      },
      required: true,
    },
    hasInclusionPolicy: {
      type: Boolean,
      required: true,
      default: () => {
        return false
      },
    },
  },
  created() {
    this.SUPPORT_CHECKBOX_LABELS = SUPPORT_CHECKBOX_LABELS
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
  },

  methods: {
    selectedFunding(model) {
      return this.SUPPORT_CHECKBOX_LABELS.filter((item) => model.supportFundingModel.includes(item.value))
    },
    isOtherBoxDisplayed(model) {
      return model.supportFundingModel.includes(this.SUPPORT_CHECKBOX_LABELS.find((item) => item.label === 'Other').value)
    },
  },
}
</script>
