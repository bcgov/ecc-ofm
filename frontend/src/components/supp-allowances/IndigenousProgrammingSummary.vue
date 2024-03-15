<template>
  <v-container fluid class="pa-2 pb-0">
    <!-- <h4 class="mb-2">Indigenous Programming Allowance</h4> -->
    <div class="mt-4">
      <h4 class="text-decoration-underline">Funding Selected</h4>
      <ul>
        <li v-for="item in indigenousProgrammingModel.indigenousFundingModel" :key="item.value" class="ml-10 my-2">
          test
          {{ item }}
          {{ INDIG_CHECKBOX_LABELS[item] }}
          {{ getLabel(item) }}
          <!-- <v-checkbox v-model="model.indigenousFundingModel" density="compact" class="pl-8" prepend-icon :label="item.label" :value="item.value"></v-checkbox> -->
        </li>
      </ul>
    </div>

    <div v-if="indigenousProgrammingModel.indigenousOtherDescription">
      <p>
        {{ indigenousProgrammingModel.indigenousOtherDescription }}
      </p>
    </div>
    <!-- <AppMissingInfoError v-else :to="{ name: 'supp-allowances-form', hash: '#', params: { applicationGuid: $route.params.applicationGuid } }">ERROR!!</AppMissingInfoError> -->
  </v-container>
</template>

<script>
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import FacilityInfo from '@/components/facilities/FacilityInfo.vue'
import ContactInfo from '@/components/applications/ContactInfo.vue'
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
  computed: {},
  created() {
    this.INDIG_CHECKBOX_LABELS = INDIG_CHECKBOX_LABELS
    //console.log(this.indigenousProgrammingModel)

    //console.log(INDIG_CHECKBOX_LABELS)
  },
  methods: {
    getLabel(value) {
      //console.log(this.INDIG_CHECKBOX_LABELS)
      console.log(value)
      console.log(this.INDIG_CHECKBOX_LABELS[value])
      return '111'
    },
  },
}
</script>
