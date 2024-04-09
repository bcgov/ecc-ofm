<template>
  <v-form ref="form">
    <h2 class="mb-4">Service Delivery Details</h2>
    <h4 class="mb-2">
      Your facility:
      <span class="facility-name ml-6">{{ currentApplication?.facilityName }}</span>
    </h4>

    <div v-if="!isEmpty(currentApplication?.licences)">
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
          <v-expansion-panel-title>
            <LicenceHeader :licence="licence" />
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <LicenceDetails :licence="licence" @update="updateModel" @isDetailsComplete="setDetailsComplete" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-checkbox
        id="confirmation"
        v-model="licenceDeclaration"
        color="primary"
        :rules="rules.required"
        :disabled="readonly"
        label="I confirm that the above information is correct."
        class="mt-4"></v-checkbox>
    </div>

    <AppMissingInfoError v-else-if="validation && !processing">{{ APPLICATION_ERROR_MESSAGES.LICENCE_INFO }}</AppMissingInfoError>

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
import { APPLICATION_ERROR_MESSAGES } from '@/utils/constants'
import LicenceHeader from '@/components/licences/LicenceHeader.vue'
import LicenceDetails from '@/components/licences/LicenceDetails.vue'
import LicenceService from '@/services/licenceService'
import rules from '@/utils/rules'
import ApplicationService from '@/services/applicationService'
import alertMixin from '@/mixins/alertMixin'
import { isEmpty } from 'lodash'

export default {
  name: 'ServiceDeliveryView',
  components: { AppButton, AppMissingInfoError, LicenceHeader, LicenceDetails },
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
      rules,
      processing: false,
      licences: [],
      panel: [],
      licenceDeclaration: undefined,
      changedLicences: [],
      isFormComplete: undefined,
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'validation', 'isApplicationReadonly']),
    ...mapWritableState(useApplicationsStore, ['isServiceDeliveryComplete']),
    readonly() {
      return this.isApplicationReadonly || this.processing
    },
    allLicenceIDs() {
      return this.currentApplication?.licences?.map((licence) => licence.licenceId)
    },
  },
  watch: {
    licenceDeclaration: {
      handler() {
        this.setFormComplete()
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
    this.$emit('process', false)
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
        this.processing = true
        const payload = {
          licenceDeclaration: this.licenceDeclaration,
        }
        if (ApplicationService.isApplicationUpdated(payload)) {
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, payload)
          await this.getApplication(this.$route.params.applicationGuid)
        }
        if (this.changedLicences.length > 0) {
          for (const licence of this.changedLicences) {
            await LicenceService.updateLicenceDetails(licence.licenceDetailId, licence)
          }
          this.changedLicences = []
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

    togglePanel() {
      this.panel = isEmpty(this.panel) ? this.allLicenceIDs : []
    },
    updateModel(updatedModel) {
      let found = this.changedLicences.find((el) => el.licenceDetailId == updatedModel.licenceDetailId)

      if (!found) {
        this.changedLicences.push(updatedModel)
      } else {
        found.roomSplitDetails = updatedModel.roomSplitDetails
        found.applyRoomSplitCondition = updatedModel.applyRoomSplitCondition
      }
    },
    setDetailsComplete(licenceId, value) {
      const currentLicence = this.currentApplication?.licences.find((el) => el.licenceId === licenceId)

      console.log('value.valid ', value.valid)
      currentLicence.isLicenceComplete = value.valid

      console.log('curr lic complete ', currentLicence.isLicenceComplete)

      this.setFormComplete()
    },
    setFormComplete() {
      this.isServiceDeliveryComplete = this.currentApplication.licences.every((el) => el.isLicenceComplete) && this.licenceDeclaration
      //console.log('is done? ', this.isServiceDeliveryComplete)
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

:deep(.v-label) {
  opacity: 1;
}
</style>
