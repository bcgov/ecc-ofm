<template>
  <v-container fluid class="pa-2 pb-0">
    <template v-if="!readonly">
      <AppMissingInfoError
        v-if="isEmpty(currentApplication?.licences)"
        :to="{ name: APPLICATION_ROUTES.SERVICE_DELIVERY, hash: '#account-management', params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.LICENCE_INFO }}
      </AppMissingInfoError>
      <AppMissingInfoError
        v-else-if="!currentApplication?.licenceDeclaration"
        :to="{ name: APPLICATION_ROUTES.SERVICE_DELIVERY, hash: '#confirmation', params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.LICENCE_CONFIRMATION }}
      </AppMissingInfoError>
      <AppMissingInfoError v-else-if="!isServiceDeliveryComplete" :to="{ name: APPLICATION_ROUTES.SERVICE_DELIVERY, hash: '#top', params: { applicationGuid: $route.params.applicationGuid } }">
        {{ !allCCOFMissingDetailComplete ? APPLICATION_ERROR_MESSAGES.LICENCE_INFO : APPLICATION_ERROR_MESSAGES.SPLIT_CLASSROOM_INFO }}
      </AppMissingInfoError>
    </template>
    <v-expansion-panels v-if="showSummary" v-model="panel" multiple>
      <v-expansion-panel v-for="licence in licences" :key="licence.licenceId" :value="licence.licenceId">
        <v-expansion-panel-title>
          <LicenceHeader :licence="licence" />
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <LicenceDetails :licence="licence" :readOnly="true" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash'
import { mapState } from 'pinia'

import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import { useApplicationsStore } from '@/stores/applications'
import LicenceHeader from '@/components/licences/LicenceHeader.vue'
import LicenceDetails from '@/components/licences/LicenceDetails.vue'
import LicenceService from '@/services/licenceService'
import { APPLICATION_ERROR_MESSAGES, APPLICATION_ROUTES } from '@/utils/constants'

export default {
  components: { AppMissingInfoError, LicenceHeader, LicenceDetails },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    licences: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      panel: [],
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    ...mapState(useApplicationsStore, ['isServiceDeliveryComplete']),
    allLicenceIDs() {
      return this.licences?.map((licence) => licence.licenceId)
    },
    allCCOFMissingDetailComplete() {
      return this.currentApplication?.licences.every((licence) => {
        return licence.licenceDetails?.every(
          (detail) =>
            LicenceService.isOperationalSpacesValid(detail.operationalSpaces) &&
            LicenceService.isEnrolledSpacesValid(detail.enrolledSpaces) &&
            LicenceService.isWeeksInOperationValid(detail.weeksInOperation) &&
            !isEmpty(detail.operationFromTime) &&
            !isEmpty(detail.operationToTime) &&
            !isEmpty(detail.weekDays),
        )
      })
    },
    showSummary() {
      return !isEmpty(this.currentApplication?.licences) && (this.readonly || this.isServiceDeliveryComplete)
    },
  },
  async created() {
    this.panel = this.allLicenceIDs
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.APPLICATION_ROUTES = APPLICATION_ROUTES
  },
  methods: {
    isEmpty,
  },
}
</script>
