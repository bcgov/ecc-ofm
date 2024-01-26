<template>
  <v-form ref="form">
    <v-row no-gutters class="mt-4"><strong>Please provide operating costs for the selected facility:</strong></v-row>
    <v-row no-gutters class="mt-4">
      <v-col cols="12" md="3" lg="2" class="mt-4">
        <AppLabel>Facility type:</AppLabel>
      </v-col>
      <v-col cols="10" md="7" lg="5" class="mt-3">
        <v-select
          id="facility-types"
          v-model="model.facilityType"
          :items="facilityTypes"
          :disabled="readonly"
          item-title="description"
          item-value="id"
          label="Select a facility type"
          :rules="rules.required"
          density="compact"
          variant="outlined"></v-select>
      </v-col>
      <v-col cols="2" md="2" lg="1" class="mt-4" align="center">
        <v-tooltip content-class="tooltip" :text="FACILITY_TYPE_INFO_TXT">
          <template v-slot:activator="{ props }">
            <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>
    <YearlyOperatingCost v-if="model.facilityType" :readonly="readonly" @update="updateModel" />
    <YearlyFacilityCost v-if="model.facilityType" class="my-8" :readonly="readonly" :facilityType="model.facilityType" @update="updateModel" />
  </v-form>
</template>

<script>
import { useAppStore } from '@/stores/app'
import { useApplicationsStore } from '@/stores/applications'
import { mapState, mapWritableState, mapActions } from 'pinia'
import { APPLICATION_STATUS_CODES } from '@/utils/constants'
import ApplicationService from '@/services/applicationService'
import alertMixin from '@/mixins/alertMixin'
import rules from '@/utils/rules'

import AppLabel from '@/components/ui/AppLabel.vue'
import YearlyOperatingCost from '@/components/applications/YearlyOperatingCost.vue'
import YearlyFacilityCost from '@/components/applications/YearlyFacilityCost.vue'

export default {
  name: 'OperatingCostsView',
  components: { AppLabel, YearlyOperatingCost, YearlyFacilityCost },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (!this.readonly) {
      await this.saveApplication()
    }
    next()
  },
  props: {
    back: {
      type: Boolean,
      default: false,
    },
    next: {
      type: Boolean,
      default: false,
    },
    save: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['process'],
  data() {
    return {
      rules,
      model: {},
      costsModel: {},
      FACILITY_TYPE_INFO_TXT: 'This is a placeholder message',
    }
  },
  computed: {
    ...mapState(useAppStore, ['facilityTypes']),
    ...mapState(useApplicationsStore, ['currentApplication']),
    ...mapWritableState(useApplicationsStore, ['isOperatingCostsComplete']),
    readonly() {
      return this.currentApplication?.statusCode != APPLICATION_STATUS_CODES.DRAFT
    },
    sanitizedModel() {
      const sanitizedModel = {}
      Object.keys(this.model)?.forEach((key) => {
        if (key === 'facilityType' || Number(this.model[key]) <= 5000000) {
          sanitizedModel[key] = this.model[key]
        }
      })
      return sanitizedModel
    },
    isFormComplete() {
      const totalCosts = Object.values(this.costsModel)?.reduce((total, cost) => total + Number(cost), 0)
      return this.model.facilityType && totalCosts > 0
    },
  },
  watch: {
    isFormComplete: {
      handler(value) {
        this.isOperatingCostsComplete = value
      },
    },
    back: {
      handler() {
        this.$router.push({ name: 'licences', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    next: {
      handler() {
        this.$router.push({ name: 'staffing', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
  },
  created() {
    this.model.facilityType = this.currentApplication?.facilityType
  },
  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),

    async saveApplication(showAlert = false) {
      try {
        if (ApplicationService.isApplicationUpdated(this.sanitizedModel)) {
          this.$emit('process', true)
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, this.sanitizedModel)
          await this.getApplication(this.$route.params.applicationGuid)
        }
        if (showAlert) {
          this.setSuccessAlert('Application saved successfully')
        }
      } catch (error) {
        this.setFailureAlert('Failed to save your application', error)
      } finally {
        this.$emit('process', false)
      }
    },

    updateModel(updatedModel) {
      Object.entries(updatedModel)?.forEach(([key, value]) => {
        this.costsModel[key] = Number(value)
        this.model[key] = Number(value)
      })
    },
  },
}
</script>
<style scoped></style>
