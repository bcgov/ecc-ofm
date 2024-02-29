<template>
  <v-form ref="form">
    <v-row no-gutters class="mt-4"><strong>Please provide staffing information for the selected facility:</strong></v-row>
    <AppMissingInfoError v-if="validation && !isStaffingComplete">Staffing information required</AppMissingInfoError>
    <v-card class="my-6 pa-4" variant="outlined">
      <v-row no-gutters>
        <v-col cols="5">
          <h4>Employee Category</h4>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <h4>Full-Time Position</h4>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <h4>Part-Time Position</h4>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-6">
        <v-col cols="5">
          <p>Infant/Toddler Early Childhood Educator</p>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model="model.staffingInfantECEducatorFullTime"
            variant="outlined"
            density="compact"
            :disabled="readonly"
            maxlength="2"
            @input="sanitizeInput('staffingInfantECEducatorFullTime')"></v-text-field>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model="model.staffingInfantECEducatorPartTime"
            variant="outlined"
            density="compact"
            :disabled="readonly"
            maxlength="2"
            @input="sanitizeInput('staffingInfantECEducatorPartTime')"></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-1">
        <v-col cols="5">
          <p>Early Childhood Educator</p>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model="model.staffingECEducatorFullTime"
            variant="outlined"
            density="compact"
            :disabled="readonly"
            maxlength="2"
            @input="sanitizeInput('staffingECEducatorFullTime')"></v-text-field>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model="model.staffingECEducatorPartTime"
            variant="outlined"
            density="compact"
            :disabled="readonly"
            maxlength="2"
            @input="sanitizeInput('staffingECEducatorPartTime')"></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-1">
        <v-col cols="5">
          <p>Early Childhood Educator Assistant</p>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model="model.staffingECEducatorAssistantFullTime"
            variant="outlined"
            density="compact"
            :disabled="readonly"
            maxlength="2"
            @input="sanitizeInput('staffingECEducatorAssistantFullTime')"></v-text-field>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model="model.staffingECEducatorAssistantPartTime"
            variant="outlined"
            density="compact"
            :disabled="readonly"
            maxlength="2"
            @input="sanitizeInput('staffingECEducatorAssistantPartTime')"></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-1">
        <v-col cols="5">
          <p>Responsible Adult</p>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model="model.staffingResponsibleAdultFullTime"
            variant="outlined"
            density="compact"
            :disabled="readonly"
            maxlength="2"
            @input="sanitizeInput('staffingResponsibleAdultFullTime')"></v-text-field>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model="model.staffingResponsibleAdultPartTime"
            variant="outlined"
            density="compact"
            :disabled="readonly"
            maxlength="2"
            @input="sanitizeInput('staffingResponsibleAdultPartTime')"></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-1">
        <v-col cols="5">
          <AppLabel>Total</AppLabel>
        </v-col>
        <v-col cols="3" class="px-2">
          <p align="center">
            <strong>{{ totalFullTimePosition }}</strong>
          </p>
        </v-col>
        <v-col cols="3" class="px-2">
          <p align="center">
            <strong>{{ totalPartTimePosition }}</strong>
          </p>
        </v-col>
      </v-row>
    </v-card>
  </v-form>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'

import { useApplicationsStore } from '@/stores/applications'
import { mapState, mapWritableState, mapActions } from 'pinia'
import ApplicationService from '@/services/applicationService'
import alertMixin from '@/mixins/alertMixin'

export default {
  name: 'StaffingView',
  components: { AppLabel, AppMissingInfoError },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (!this.readonly) {
      await this.saveApplication()
    }
    next(!this.processing) // only go to the next page after saveApplication is complete
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
      model: {},
      processing: false,
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'validation', 'isApplicationReadonly']),
    ...mapWritableState(useApplicationsStore, ['isStaffingComplete']),
    readonly() {
      return this.isApplicationReadonly || this.processing
    },
    totalFullTimePosition() {
      return this.model.staffingInfantECEducatorFullTime + this.model.staffingECEducatorFullTime + this.model.staffingECEducatorAssistantFullTime + this.model.staffingResponsibleAdultFullTime
    },
    totalPartTimePosition() {
      return this.model.staffingInfantECEducatorPartTime + this.model.staffingECEducatorPartTime + this.model.staffingECEducatorAssistantPartTime + this.model.staffingResponsibleAdultPartTime
    },
    isFormComplete() {
      const totalStaffs = this.totalFullTimePosition + this.totalPartTimePosition
      return totalStaffs > 0
    },
  },
  watch: {
    isFormComplete: {
      handler(value) {
        this.isStaffingComplete = value
      },
    },
    back: {
      handler() {
        this.$router.push({ name: 'operating-costs', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    next: {
      handler() {
        this.$router.push({ name: 'review-application', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
  },
  created() {
    this.$emit('process', false)
    this.model = {
      staffingInfantECEducatorFullTime: this.currentApplication?.staffingInfantECEducatorFullTime ?? 0,
      staffingInfantECEducatorPartTime: this.currentApplication?.staffingInfantECEducatorPartTime ?? 0,
      staffingECEducatorFullTime: this.currentApplication?.staffingECEducatorFullTime ?? 0,
      staffingECEducatorPartTime: this.currentApplication?.staffingECEducatorPartTime ?? 0,
      staffingECEducatorAssistantFullTime: this.currentApplication?.staffingECEducatorAssistantFullTime ?? 0,
      staffingECEducatorAssistantPartTime: this.currentApplication?.staffingECEducatorAssistantPartTime ?? 0,
      staffingResponsibleAdultFullTime: this.currentApplication?.staffingResponsibleAdultFullTime ?? 0,
      staffingResponsibleAdultPartTime: this.currentApplication?.staffingResponsibleAdultPartTime ?? 0,
    }
  },
  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),

    async saveApplication(showAlert = false) {
      try {
        if (ApplicationService.isApplicationUpdated(this.model)) {
          this.$emit('process', true)
          this.processing = true
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, this.model)
          await this.getApplication(this.$route.params.applicationGuid)
        }
        if (showAlert) {
          this.setSuccessAlert('Application saved successfully')
        }
      } catch (error) {
        this.setFailureAlert('Failed to save your application', error)
      } finally {
        this.$emit('process', false)
        this.processing = false
      }
    },

    sanitizeInput(key) {
      this.model[key] = this.model[key]?.replace(/[^0-9]/g, '')
      this.model[key] = Number(this.model[key])
    },
  },
}
</script>
<style scoped>
:deep(input) {
  text-align: center;
}
:deep(.v-text-field) {
  max-width: 200px;
}
</style>
