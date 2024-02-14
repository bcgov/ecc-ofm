<template>
  <v-form ref="form">
    <h2 class="mb-4">Service Delivery Details</h2>
    <h4 class="mb-2">
      Your facility:
      <span class="facility-name ml-6">{{ currentApplication?.facilityName }}</span>
    </h4>

    <div v-if="currentApplication?.licences?.length > 0">
      <v-row no-gutters class="mb-2">
        <v-col cols="12" align="right">
          <AppButton v-if="isEmpty(panel)" id="expand-button" :primary="false" size="large" width="200px" @click="togglePanel">
            <v-icon>mdi-arrow-expand-vertical</v-icon>
            Expand All
          </AppButton>
          <AppButton v-else id="collapse-button" :primary="false" size="large" width="200px" @click="togglePanel">
            <v-icon>mdi-arrow-collapse-vertical</v-icon>
            Collapse All
          </AppButton>
        </v-col>
      </v-row>
      <v-expansion-panels v-model="panel" multiple>
        <v-expansion-panel v-for="licence in currentApplication?.licences" :key="licence.licenceId" :value="licence.licenceId">
          <v-expansion-panel-title class="header-label">
            <LicenceHeader :licence="licence" />
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <h4 class="mb-2 text-decoration-underline">Category Details</h4>
            <LicenceDetails :licenceDetails="licence.licenceDetails" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-checkbox
        id="confirmation"
        v-model="licenceDeclaration"
        :value="1"
        :false-value="0"
        :true-value="1"
        color="primary"
        :rules="rules.required"
        :disabled="readonly || processing"
        label="I confirm that the above information is correct."
        class="mt-4"></v-checkbox>
    </div>

    <AppMissingInfoError v-else-if="validation">{{ APPLICATION_ERROR_MESSAGES.LICENCE_INFO }}</AppMissingInfoError>

    <p id="account-management">
      Your organization account manager can update licence details in
      <router-link :to="{ name: 'manage-facility', params: { facilityId: currentApplication?.facilityId } }">Account Management</router-link>
    </p>
  </v-form>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'

import { useApplicationsStore } from '@/stores/applications'
import { mapState, mapWritableState, mapActions } from 'pinia'
import { APPLICATION_STATUS_CODES, APPLICATION_ERROR_MESSAGES } from '@/utils/constants'
import LicenceHeader from '@/components/licences/LicenceHeader.vue'
import LicenceDetails from '@/components/licences/LicenceDetails.vue'
import rules from '@/utils/rules'
import ApplicationService from '@/services/applicationService'
import alertMixin from '@/mixins/alertMixin'
import { isEmpty } from 'lodash'

export default {
  name: 'ServiceDeliveryView',
  components: { AppButton, AppMissingInfoError, LicenceHeader, LicenceDetails },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    this.processing = true
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
      processing: false,
      licences: [],
      panel: [],
      licenceDeclaration: undefined,
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'validation']),
    ...mapWritableState(useApplicationsStore, ['isServiceDeliveryComplete']),
    readonly() {
      return this.currentApplication?.statusCode != APPLICATION_STATUS_CODES.DRAFT
    },
    allLicenceIDs() {
      return this.currentApplication?.licences?.map((licence) => licence.licenceId)
    },
  },
  watch: {
    licenceDeclaration: {
      handler(value) {
        this.isServiceDeliveryComplete = value
      },
    },
    back: {
      handler() {
        this.$router.push({ name: 'facility-details', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    next: {
      handler() {
        this.$router.push({ name: 'operating-costs', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
  },
  created() {
    this.licenceDeclaration = this.currentApplication?.licenceDeclaration
    this.panel = this.allLicenceIDs
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
  },
  async mounted() {
    if (this.validation) {
      await this.$refs.form?.validate()
    }
  },
  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),
    isEmpty,
    async saveApplication(showAlert = false) {
      try {
        this.$emit('process', true)
        const payload = {
          licenceDeclaration: this.licenceDeclaration,
        }
        if (ApplicationService.isApplicationUpdated(payload)) {
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, payload)
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

    togglePanel() {
      this.panel = isEmpty(this.panel) ? this.allLicenceIDs : []
    },
  },
}
</script>
<style scoped>
.facility-name {
  color: #003366;
  font-size: 1.3em;
  text-decoration: underline;
}
.header-label {
  font-size: 1.03em;
}
:deep(.v-label) {
  opacity: 1;
}
</style>
