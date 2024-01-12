<template>
  <v-form ref="form" v-model="isFormComplete">
    <v-row no-gutters class="mt-4"><strong>Please provide staffing information for the selected facility:</strong></v-row>
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
            v-model.number="model.staffingInfantECEducatorFullTime"
            variant="outlined"
            density="compact"
            type="number"
            :disabled="readonly"
            :rules="[...rules.required, rules.min(0), rules.max(99), rules.wholeNumber]"></v-text-field>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model.number="model.staffingInfantECEducatorPartTime"
            variant="outlined"
            density="compact"
            type="number"
            :disabled="readonly"
            :rules="[...rules.required, rules.min(0), rules.max(99), rules.wholeNumber]"></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-1">
        <v-col cols="5">
          <p>Early Childhood Educator</p>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model.number="model.staffingECEducatorFullTime"
            variant="outlined"
            density="compact"
            type="number"
            :disabled="readonly"
            :rules="[...rules.required, rules.min(0), rules.max(99), rules.wholeNumber]"></v-text-field>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model.number="model.staffingECEducatorPartTime"
            variant="outlined"
            density="compact"
            type="number"
            :disabled="readonly"
            :rules="[...rules.required, rules.min(0), rules.max(99), rules.wholeNumber]"></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-1">
        <v-col cols="5">
          <p>Early Childhood Educator Assistant</p>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model.number="model.staffingECEducatorAssistantFullTime"
            variant="outlined"
            density="compact"
            type="number"
            :disabled="readonly"
            :rules="[...rules.required, rules.min(0), rules.max(99), rules.wholeNumber]"></v-text-field>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model.number="model.staffingECEducatorAssistantPartTime"
            variant="outlined"
            density="compact"
            type="number"
            :disabled="readonly"
            :rules="[...rules.required, rules.min(0), rules.max(99), rules.wholeNumber]"></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-1">
        <v-col cols="5">
          <p>Responsible Adult</p>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model.number="model.staffingResponsibleAdultFullTime"
            variant="outlined"
            density="compact"
            type="number"
            :disabled="readonly"
            :rules="[...rules.required, rules.min(0), rules.max(99), rules.wholeNumber]"></v-text-field>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <v-text-field
            v-model.number="model.staffingResponsibleAdultPartTime"
            variant="outlined"
            density="compact"
            type="number"
            :disabled="readonly"
            :rules="[...rules.required, rules.min(0), rules.max(99), rules.wholeNumber]"></v-text-field>
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
import { useApplicationsStore } from '@/stores/applications'
import { mapState, mapActions } from 'pinia'
import { APPLICATION_STATUS_CODES } from '@/utils/constants'
import rules from '@/utils/rules'
import ApplicationService from '@/services/applicationService'
import alertMixin from '@/mixins/alertMixin'

export default {
  name: 'StaffingView',
  components: { AppLabel },
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
      isFormComplete: false,
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    readonly() {
      return this.currentApplication?.statusCode != APPLICATION_STATUS_CODES.DRAFT
    },
    totalFullTimePosition() {
      return (
        Number(this.model.staffingInfantECEducatorFullTime) +
        Number(this.model.staffingECEducatorFullTime) +
        Number(this.model.staffingECEducatorAssistantFullTime) +
        Number(this.model.staffingResponsibleAdultFullTime)
      )
    },
    totalPartTimePosition() {
      return (
        Number(this.model.staffingInfantECEducatorPartTime) +
        Number(this.model.staffingECEducatorPartTime) +
        Number(this.model.staffingECEducatorAssistantPartTime) +
        Number(this.model.staffingResponsibleAdultPartTime)
      )
    },
    isStaffingComplete() {
      const totalStaffs = this.totalFullTimePosition + this.totalPartTimePosition
      return totalStaffs > 0 && this.isFormComplete
    },
    // Remove all invalid values from payload before sending it to CRM
    sanitizedModel() {
      const sanitizedModel = Object.assign({}, this.model)
      Object.entries(sanitizedModel)?.forEach(([key, value]) => {
        if (typeof value != 'number' || value < 0 || value > 99) {
          delete sanitizedModel[key]
        }
      })
      return sanitizedModel
    },
  },
  watch: {
    isStaffingComplete: {
      handler(value) {
        this.setIsStaffingComplete(value)
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
        this.$router.push({ name: 'submit-application', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
  },
  created() {
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
    ...mapActions(useApplicationsStore, ['getApplication', 'setIsStaffingComplete']),

    async saveApplication(showAlert = false) {
      try {
        if (ApplicationService.isApplicationUpdated(this.sanitizedModel)) {
          this.$emit('process', true)
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, this.sanitizedModel)
          await this.getApplication(this.$route.params.applicationGuid)
        }
        if (showAlert) {
          this.setSuccessAlert('Application is saved successfully')
        }
      } catch (error) {
        this.setFailureAlert('Failed to save your application', error)
      } finally {
        this.$emit('process', false)
      }
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
