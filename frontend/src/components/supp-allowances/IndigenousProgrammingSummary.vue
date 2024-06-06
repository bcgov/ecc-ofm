<template>
  <v-card v-for="model in indigenousProgrammingModels" :key="model.indigenousProgrammingModels ? model.indigenousProgrammingModels : model.id" fluid class="pb-0 my-5">
    <AppAlertBanner v-if="model.isNextTerm" type="info">
      <div>This Supplementary Application is for Next Year</div>
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
        <p v-if="model.indigenousOtherDescription" class="ml-12 my-2">
          {{ model.indigenousOtherDescription }}
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
import { INDIG_CHECKBOX_LABELS } from '@/utils/constants/suppConstants'

export default {
  components: { AppAlertBanner, AppMissingInfoError },
  props: {
    indigenousProgrammingModels: {
      type: Array,
      default: () => {
        return []
      },
      required: true,
    },
  },
  computed: {},
  created() {
    this.INDIG_CHECKBOX_LABELS = INDIG_CHECKBOX_LABELS
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
  },
  methods: {
    isOtherBoxDisplayed(model) {
      return model.indigenousFundingModel?.includes(this.INDIG_CHECKBOX_LABELS.find((item) => item.label === 'Other').value)
    },
    selectedFunding(model) {
      return this.INDIG_CHECKBOX_LABELS.filter((item) => model.indigenousFundingModel.includes(item.value))
    },
  },
}
</script>
