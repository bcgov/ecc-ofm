<template>
  <v-form ref="form">
    <v-row no-gutters class="mt-4"><strong>Please provide staffing information for the selected facility:</strong></v-row>
    <div v-if="!readonly && validation && !isStaffingComplete">
      <AppMissingInfoError v-if="!isThereAtLeastOneEmployee(model)">{{ APPLICATION_ERROR_MESSAGES.STAFFING }}</AppMissingInfoError>
      <AppMissingInfoError v-if="!areAllEmployeeCertificatesEntered(allUpdatedCertificates, model)">{{ APPLICATION_ERROR_MESSAGES.MISMATCH_NUMBER_STAFF_CERTIFICATE }}</AppMissingInfoError>
      <AppMissingInfoError v-if="!areAllCertificateInitialsUnique(allUpdatedCertificates)">{{ APPLICATION_ERROR_MESSAGES.DUPLICATE_CERTIFICATE_INITIALS }}</AppMissingInfoError>
      <AppMissingInfoError v-if="!areAllCertificateNumbersUnique(allUpdatedCertificates)">{{ APPLICATION_ERROR_MESSAGES.DUPLICATE_CERTIFICATE_NUMBERS }}</AppMissingInfoError>
    </div>
    <v-card class="my-6 pa-4" variant="outlined">
      <v-row no-gutters>
        <v-col cols="4">
          <h4>Employee Category</h4>
        </v-col>
        <v-col cols="4" align="center">
          <h4>Full-Time Position</h4>
        </v-col>
        <v-col cols="4" align="center">
          <h4>Part-Time Position</h4>
        </v-col>
      </v-row>

      <v-card class="soft-outline my-6 py-4" variant="outlined">
        <v-row no-gutters>
          <v-col cols="4" class="px-4">
            <p>Infant/Toddler Early Childhood Educator</p>
          </v-col>
          <v-col cols="4" class="px-4">
            <v-text-field
              v-model="model.staffingInfantECEducatorFullTime"
              variant="outlined"
              density="compact"
              :disabled="readonly"
              maxlength="2"
              hide-details
              @input="sanitizeInput('staffingInfantECEducatorFullTime')" />
          </v-col>
          <v-col cols="4" align="center" class="px-4">
            <v-text-field
              v-model="model.staffingInfantECEducatorPartTime"
              variant="outlined"
              density="compact"
              :disabled="readonly"
              maxlength="2"
              hide-details
              @input="sanitizeInput('staffingInfantECEducatorPartTime')" />
          </v-col>
        </v-row>
        <StaffingCertificateInput
          v-if="totalInfantECEducatorStaff > 0 || updatedITECertificates?.length > 0"
          v-model="updatedITECertificates"
          :readonly="readonly"
          :employee-count="totalInfantECEducatorStaff"
          :employee-type="APPLICATION_PROVIDER_EMPLOYEE_TYPES.ITE"
          :all-certificates="allUpdatedCertificates" />
      </v-card>

      <v-card class="soft-outline my-6 py-4" variant="outlined">
        <v-row no-gutters class="px-4">
          <v-col cols="4">
            <p>Early Childhood Educator</p>
          </v-col>
          <v-col cols="4" align="center" class="px-4">
            <v-text-field
              v-model="model.staffingECEducatorFullTime"
              variant="outlined"
              density="compact"
              :disabled="readonly"
              maxlength="2"
              hide-details
              @input="sanitizeInput('staffingECEducatorFullTime')" />
          </v-col>
          <v-col cols="4" align="center" class="px-4">
            <v-text-field
              v-model="model.staffingECEducatorPartTime"
              variant="outlined"
              density="compact"
              :disabled="readonly"
              maxlength="2"
              hide-details
              @input="sanitizeInput('staffingECEducatorPartTime')" />
          </v-col>
        </v-row>
        <StaffingCertificateInput
          v-if="totalECEducatorStaff > 0 || updatedECECertificates?.length > 0"
          v-model="updatedECECertificates"
          :readonly="readonly"
          :employee-count="totalECEducatorStaff"
          :employee-type="APPLICATION_PROVIDER_EMPLOYEE_TYPES.ECE"
          :all-certificates="allUpdatedCertificates" />
      </v-card>

      <v-card class="soft-outline my-6 py-4" variant="outlined">
        <v-row no-gutters class="px-4">
          <v-col cols="4">
            <p>Early Childhood Educator Assistant</p>
          </v-col>
          <v-col cols="4" align="center" class="px-4">
            <v-text-field
              v-model="model.staffingECEducatorAssistantFullTime"
              variant="outlined"
              density="compact"
              :disabled="readonly"
              maxlength="2"
              hide-details
              @input="sanitizeInput('staffingECEducatorAssistantFullTime')" />
          </v-col>
          <v-col cols="4" align="center" class="px-4">
            <v-text-field
              v-model="model.staffingECEducatorAssistantPartTime"
              variant="outlined"
              density="compact"
              :disabled="readonly"
              maxlength="2"
              hide-details
              @input="sanitizeInput('staffingECEducatorAssistantPartTime')" />
          </v-col>
        </v-row>
        <StaffingCertificateInput
          v-if="totalECEducatorAssistantStaff > 0 || updatedECEACertificates?.length > 0"
          v-model="updatedECEACertificates"
          :readonly="readonly"
          :employee-count="totalECEducatorAssistantStaff"
          :employee-type="APPLICATION_PROVIDER_EMPLOYEE_TYPES.ECEA"
          :all-certificates="allUpdatedCertificates" />
      </v-card>

      <v-card class="soft-outline my-6 pa-4" variant="outlined">
        <v-row no-gutters>
          <v-col cols="4">
            <p>Responsible Adult</p>
          </v-col>
          <v-col cols="4" align="center" class="px-4">
            <v-text-field
              v-model="model.staffingResponsibleAdultFullTime"
              variant="outlined"
              density="compact"
              :disabled="readonly"
              maxlength="2"
              hide-details
              @input="sanitizeInput('staffingResponsibleAdultFullTime')" />
          </v-col>
          <v-col cols="4" align="center" class="px-4">
            <v-text-field
              v-model="model.staffingResponsibleAdultPartTime"
              variant="outlined"
              density="compact"
              :disabled="readonly"
              maxlength="2"
              hide-details
              @input="sanitizeInput('staffingResponsibleAdultPartTime')" />
          </v-col>
        </v-row>
      </v-card>

      <v-row no-gutters>
        <v-col cols="4">
          <AppLabel class="pl-4">Total</AppLabel>
        </v-col>
        <v-col cols="4" class="px-2">
          <p align="center">
            <strong>{{ totalFullTimePosition }}</strong>
          </p>
        </v-col>
        <v-col cols="4" class="px-2">
          <p align="center">
            <strong>{{ totalPartTimePosition }}</strong>
          </p>
        </v-col>
      </v-row>
    </v-card>
  </v-form>
</template>

<script>
import { cloneDeep } from 'lodash'

import AppLabel from '@/components/ui/AppLabel.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import StaffingCertificateInput from '@/components/applications/StaffingCertificateInput.vue'

import { useApplicationsStore } from '@/stores/applications'
import { mapState, mapWritableState, mapActions } from 'pinia'
import ApplicationService from '@/services/applicationService'
import alertMixin from '@/mixins/alertMixin'
import { APPLICATION_ROUTES, APPLICATION_PROVIDER_EMPLOYEE_TYPES, APPLICATION_ERROR_MESSAGES } from '@/utils/constants'
import { sanitizeWholeNumberInput } from '@/utils/common'

export default {
  name: 'StaffingView',
  components: { AppLabel, AppMissingInfoError, StaffingCertificateInput },
  mixins: [alertMixin],

  async beforeRouteLeave(_to, _from, next) {
    if (!this.readonly) {
      await this.saveApplication()
    }
    next(!this.processing) // only go to the next page after saveApplication is complete
  },

  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
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
      updatedECECertificates: [],
      updatedECEACertificates: [],
      updatedITECertificates: [],
      processing: false,
    }
  },

  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'validation']),
    ...mapWritableState(useApplicationsStore, ['isStaffingComplete']),

    totalFullTimePosition() {
      return this.model.staffingInfantECEducatorFullTime + this.model.staffingECEducatorFullTime + this.model.staffingECEducatorAssistantFullTime + this.model.staffingResponsibleAdultFullTime
    },
    totalPartTimePosition() {
      return this.model.staffingInfantECEducatorPartTime + this.model.staffingECEducatorPartTime + this.model.staffingECEducatorAssistantPartTime + this.model.staffingResponsibleAdultPartTime
    },
    totalInfantECEducatorStaff() {
      return Number(this.model.staffingInfantECEducatorFullTime) + Number(this.model.staffingInfantECEducatorPartTime)
    },
    totalECEducatorStaff() {
      return Number(this.model.staffingECEducatorFullTime) + Number(this.model.staffingECEducatorPartTime)
    },
    totalECEducatorAssistantStaff() {
      return Number(this.model.staffingECEducatorAssistantFullTime) + Number(this.model.staffingECEducatorAssistantPartTime)
    },

    allUpdatedCertificates() {
      return this.updatedECECertificates.concat(this.updatedECEACertificates, this.updatedITECertificates)
    },
    certificatesToCreate() {
      return this.allUpdatedCertificates?.filter((certificate) => !certificate.providerEmployeeId && (certificate.initials || certificate.certificateNumber))
    },
    certificatesToUpdate() {
      return this.allUpdatedCertificates?.filter((certificate) => certificate.providerEmployeeId && certificate.isUpdated)
    },
    certificatesToDelete() {
      return this.currentApplication?.providerEmployees?.filter((certificate) => {
        const index = this.allUpdatedCertificates?.findIndex((updatedCertificate) => updatedCertificate.providerEmployeeId === certificate.providerEmployeeId)
        return index === -1
      })
    },

    isFormComplete() {
      return this.isThereAtLeastOneEmployee(this.model) && this.areEmployeeCertificatesComplete(this.allUpdatedCertificates, this.model)
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
        this.$router.push({ name: APPLICATION_ROUTES.OPERATING_COSTS, params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    next: {
      handler() {
        this.$router.push({ name: APPLICATION_ROUTES.REVIEW, params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
  },

  created() {
    this.$emit('process', false)
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.APPLICATION_PROVIDER_EMPLOYEE_TYPES = APPLICATION_PROVIDER_EMPLOYEE_TYPES
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
    this.cloneSavedCertificates()
  },

  methods: {
    ...mapActions(useApplicationsStore, [
      'getApplication',
      'isThereAtLeastOneEmployee',
      'areEmployeeCertificatesComplete',
      'areAllEmployeeCertificatesEntered',
      'areAllCertificateInitialsUnique',
      'areAllCertificateNumbersUnique',
    ]),

    async saveApplication(showAlert = false) {
      try {
        this.$emit('process', true)
        this.processing = true
        const isApplicationUpdated = ApplicationService.isApplicationUpdated(this.model)
        const isCertificatesUpdated = this.certificatesToCreate?.length > 0 || this.certificatesToUpdate?.length > 0 || this.certificatesToDelete?.length > 0
        if (isApplicationUpdated || isCertificatesUpdated) {
          if (isApplicationUpdated) {
            await ApplicationService.updateApplication(this.$route.params.applicationGuid, this.model)
          }
          if (isCertificatesUpdated) {
            await this.saveEmployeeCertificates()
          }
          await this.getApplication(this.$route.params.applicationGuid)
          this.cloneSavedCertificates()
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

    async saveEmployeeCertificates() {
      try {
        if (this.certificatesToCreate?.length > 0) {
          await Promise.all(
            this.certificatesToCreate?.map(async (certificate) => {
              await ApplicationService.createEmployeeCertificate(certificate)
            }),
          )
        }
        if (this.certificatesToUpdate?.length > 0) {
          await Promise.all(
            this.certificatesToUpdate?.map(async (certificate) => {
              await ApplicationService.updateEmployeeCertificate(certificate)
            }),
          )
        }
        if (this.certificatesToDelete?.length > 0) {
          await Promise.all(
            this.certificatesToDelete?.map(async (certificate) => {
              await ApplicationService.deleteEmployeeCertificate(certificate)
            }),
          )
        }
      } catch (error) {
        console.log('Failed to save employee certificates: ', error)
        throw error
      }
    },

    sanitizeInput(key) {
      this.model[key] = Number(sanitizeWholeNumberInput(this.model[key]))
    },

    cloneSavedCertificates() {
      this.updatedECECertificates = cloneDeep(this.currentApplication?.providerEmployees?.filter((certificate) => certificate.employeeType === APPLICATION_PROVIDER_EMPLOYEE_TYPES.ECE))
      this.updatedECEACertificates = cloneDeep(this.currentApplication?.providerEmployees?.filter((certificate) => certificate.employeeType === APPLICATION_PROVIDER_EMPLOYEE_TYPES.ECEA))
      this.updatedITECertificates = cloneDeep(this.currentApplication?.providerEmployees?.filter((certificate) => certificate.employeeType === APPLICATION_PROVIDER_EMPLOYEE_TYPES.ITE))
    },
  },
}
</script>

<style scoped>
:deep(input) {
  text-align: center;
}
</style>
