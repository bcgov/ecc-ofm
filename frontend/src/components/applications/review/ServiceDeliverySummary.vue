<template>
  <v-container fluid class="pa-2">
    <div v-if="isEmpty(currentApplication?.licences)">
      <AppMissingInfoError :to="{ name: 'service-delivery', hash: '#account-management', params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.LICENCE_INFO }}
      </AppMissingInfoError>
    </div>
    <v-expansion-panels v-else-if="currentApplication?.licenceDeclaration" v-model="panel" multiple>
      <v-expansion-panel v-for="licence in licences" :key="licence.licenceId" :value="licence.licenceId">
        <v-expansion-panel-title class="header-label">
          <LicenceHeader :licence="licence" />
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <h4 class="mb-2 text-decoration-underline">Category Details</h4>
          <LicenceDetails :licenceDetails="licence.licenceDetails" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <AppMissingInfoError v-else :to="{ name: 'service-delivery', hash: '#confirmation', params: { applicationGuid: $route.params.applicationGuid } }">
      {{ APPLICATION_ERROR_MESSAGES.LICENCE_CONFIRMATION }}
    </AppMissingInfoError>
  </v-container>
</template>

<script>
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import LicenceHeader from '@/components/licences/LicenceHeader.vue'
import LicenceDetails from '@/components/licences/LicenceDetails.vue'
import { APPLICATION_ERROR_MESSAGES } from '@/utils/constants'
import { isEmpty } from 'lodash'

export default {
  components: { AppMissingInfoError, LicenceHeader, LicenceDetails },
  props: {
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
    allLicenceIDs() {
      return this.licences?.map((licence) => licence.licenceId)
    },
  },
  async created() {
    this.panel = this.allLicenceIDs
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
  },
  methods: {
    isEmpty,
  },
}
</script>
<style scoped>
.header-label {
  font-size: 1.03em;
}
</style>
