<template>
  <v-container fluid class="pa-2 pb-0">
    <AppMissingInfoError
      v-if="!readonly && isEmpty(currentApplication?.licences)"
      :to="{ name: APPLICATION_ROUTES.SERVICE_DELIVERY, hash: '#account-management', params: { applicationGuid: $route.params.applicationGuid } }">
      {{ APPLICATION_ERROR_MESSAGES.LICENCE_INFO }}
    </AppMissingInfoError>
    <AppMissingInfoError
      v-else-if="!readonly && !currentApplication?.licenceDeclaration"
      :to="{ name: APPLICATION_ROUTES.SERVICE_DELIVERY, hash: '#confirmation', params: { applicationGuid: $route.params.applicationGuid } }">
      {{ APPLICATION_ERROR_MESSAGES.LICENCE_CONFIRMATION }}
    </AppMissingInfoError>
    <AppMissingInfoError
      v-else-if="!readonly && !isServiceDeliveryComplete"
      :to="{ name: APPLICATION_ROUTES.SERVICE_DELIVERY, hash: '#top', params: { applicationGuid: $route.params.applicationGuid } }">
      {{ APPLICATION_ERROR_MESSAGES.SPLIT_CLASSROOM_INFO }}
    </AppMissingInfoError>
    <v-expansion-panels v-else v-model="panel" multiple>
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
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import LicenceHeader from '@/components/licences/LicenceHeader.vue'
import LicenceDetails from '@/components/licences/LicenceDetails.vue'
import { APPLICATION_ERROR_MESSAGES, APPLICATION_ROUTES } from '@/utils/constants'
import { isEmpty } from 'lodash'

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
