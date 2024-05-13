<template>
  <v-container fluid class="pa-2 pb-0">
    <div v-if="!readonly && !isStaffingComplete">
      <AppMissingInfoError v-if="!isThereAtLeastOneEmployee(currentApplication)" :to="{ name: APPLICATION_ROUTES.STAFFING, params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.STAFFING }}
      </AppMissingInfoError>
      <AppMissingInfoError
        v-if="!areAllEmployeeCertificatesEntered(currentApplication?.providerEmployees, currentApplication)"
        :to="{ name: APPLICATION_ROUTES.STAFFING, params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.MISMATCH_NUMBER_STAFF_CERTIFICATE }}
      </AppMissingInfoError>
      <AppMissingInfoError
        v-if="!areAllCertificateInitialsUnique(currentApplication?.providerEmployees)"
        :to="{ name: APPLICATION_ROUTES.STAFFING, params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.DUPLICATE_CERTIFICATE_INITIALS }}
      </AppMissingInfoError>
      <AppMissingInfoError
        v-if="!areAllCertificateNumbersUnique(currentApplication?.providerEmployees)"
        :to="{ name: APPLICATION_ROUTES.STAFFING, params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.DUPLICATE_CERTIFICATE_NUMBERS }}
      </AppMissingInfoError>
    </div>
    <v-card v-else class="px-4 py-2" variant="outlined">
      <div class="border-bottom px-1 py-2">
        <v-row no-gutters>
          <v-col cols="6">
            <AppLabel>Employee Category</AppLabel>
          </v-col>
          <v-col cols="3" align="center" class="px-2">
            <AppLabel>Full-Time Position</AppLabel>
          </v-col>
          <v-col cols="3" align="center" class="px-2">
            <AppLabel>Part-Time Position</AppLabel>
          </v-col>
        </v-row>
      </div>
      <div class="border-bottom px-1 py-2">
        <v-row no-gutters>
          <v-col cols="6">
            <p>Infant/Toddler Early Childhood Educator</p>
          </v-col>
          <v-col cols="3" align="center" class="px-2">
            {{ currentApplication?.staffingInfantECEducatorFullTime }}
          </v-col>
          <v-col cols="3" align="center" class="px-2">
            {{ currentApplication?.staffingInfantECEducatorPartTime }}
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-1">
          <v-col v-for="(certificate, index) in iteCertificates" :key="index" cols="12" lg="6" xl="4" class="py-2">
            <strong>{{ index + 1 }}. Initials:</strong>
            <span class="pl-1">{{ certificate.initials }}</span>
            <strong class="pl-4">ECE certificate number:</strong>
            <span class="pl-1">{{ certificate.certificateNumber }}</span>
          </v-col>
        </v-row>
      </div>
      <div class="border-bottom px-1 py-2">
        <v-row no-gutters>
          <v-col cols="6">
            <p>Early Childhood Educator</p>
          </v-col>
          <v-col cols="3" align="center" class="px-2">
            {{ currentApplication?.staffingECEducatorFullTime }}
          </v-col>
          <v-col cols="3" align="center" class="px-2">
            {{ currentApplication?.staffingECEducatorPartTime }}
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-1">
          <v-col v-for="(certificate, index) in eceCertificates" :key="index" cols="12" lg="6" xl="4" class="py-2">
            <strong>{{ index + 1 }}. Initials:</strong>
            <span class="pl-1">{{ certificate.initials }}</span>
            <strong class="pl-4">ECE certificate number:</strong>
            <span class="pl-1">{{ certificate.certificateNumber }}</span>
          </v-col>
        </v-row>
      </div>
      <div class="border-bottom px-1 py-2">
        <v-row no-gutters>
          <v-col cols="6">
            <p>Early Childhood Educator Assistant</p>
          </v-col>
          <v-col cols="3" align="center" class="px-2">
            {{ currentApplication?.staffingECEducatorAssistantFullTime }}
          </v-col>
          <v-col cols="3" align="center" class="px-2">
            {{ currentApplication?.staffingECEducatorAssistantPartTime }}
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-1">
          <v-col v-for="(certificate, index) in eceaCertificates" :key="index" cols="12" lg="6" xl="4" class="py-2">
            <strong>{{ index + 1 }}. Initials:</strong>
            <span class="pl-1">{{ certificate.initials }}</span>
            <strong class="pl-4">ECEA certificate number:</strong>
            <span class="pl-1">{{ certificate.certificateNumber }}</span>
          </v-col>
        </v-row>
      </div>
      <v-row no-gutters class="thick-border-bottom px-1 py-2">
        <v-col cols="6">
          <p>Responsible Adult</p>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          {{ currentApplication?.staffingResponsibleAdultFullTime }}
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          {{ currentApplication?.staffingResponsibleAdultPartTime }}
        </v-col>
      </v-row>
      <v-row no-gutters class="px-1 py-2">
        <v-col cols="6">
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
  </v-container>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import { useApplicationsStore } from '@/stores/applications'
import { mapState, mapActions } from 'pinia'
import { APPLICATION_ERROR_MESSAGES, APPLICATION_ROUTES, APPLICATION_PROVIDER_EMPLOYEE_TYPES } from '@/utils/constants'

export default {
  components: { AppLabel, AppMissingInfoError },

  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'isStaffingComplete']),
    totalFullTimePosition() {
      return (
        this.currentApplication?.staffingInfantECEducatorFullTime +
        this.currentApplication?.staffingECEducatorFullTime +
        this.currentApplication?.staffingECEducatorAssistantFullTime +
        this.currentApplication?.staffingResponsibleAdultFullTime
      )
    },
    totalPartTimePosition() {
      return (
        this.currentApplication?.staffingInfantECEducatorPartTime +
        this.currentApplication?.staffingECEducatorPartTime +
        this.currentApplication?.staffingECEducatorAssistantPartTime +
        this.currentApplication?.staffingResponsibleAdultPartTime
      )
    },
    eceCertificates() {
      return this.currentApplication?.providerEmployees?.filter((certificate) => certificate.employeeType === APPLICATION_PROVIDER_EMPLOYEE_TYPES.ECE)
    },
    eceaCertificates() {
      return this.currentApplication?.providerEmployees?.filter((certificate) => certificate.employeeType === APPLICATION_PROVIDER_EMPLOYEE_TYPES.ECEA)
    },
    iteCertificates() {
      return this.currentApplication?.providerEmployees?.filter((certificate) => certificate.employeeType === APPLICATION_PROVIDER_EMPLOYEE_TYPES.ITE)
    },
  },

  created() {
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.APPLICATION_ROUTES = APPLICATION_ROUTES
  },

  methods: {
    ...mapActions(useApplicationsStore, ['isThereAtLeastOneEmployee', 'areAllEmployeeCertificatesEntered', 'areAllCertificateInitialsUnique', 'areAllCertificateNumbersUnique']),
  },
}
</script>

<style scoped>
.border-bottom {
  border-bottom: 2px solid;
}
.thick-border-bottom {
  border-bottom: 4px solid;
}
</style>
