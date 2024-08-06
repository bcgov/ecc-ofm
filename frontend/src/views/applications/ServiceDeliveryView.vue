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
            <LicenceDetails
              :loading="processing"
              :licence="licence"
              :editable="isLicenceDetailsEditable"
              :read-only="readonly"
              @update="updateLicenceDetails"
              @set-details-complete="setDetailsComplete" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-checkbox
        id="confirmation"
        v-model="licenceDeclaration"
        color="primary"
        :rules="rules.required"
        :disabled="readonly"
        :hide-details="readonly"
        label="I confirm that the above information is correct."
        class="mt-4"></v-checkbox>
    </div>

    <AppMissingInfoError v-else-if="validation && !processing">{{ APPLICATION_ERROR_MESSAGES.LICENCE_INFO }}</AppMissingInfoError>

    <p id="account-management" class="pb-3">
      Your organization account manager can update licence details in
      <router-link :to="{ name: 'manage-facility', params: { facilityId: currentApplication?.facilityId } }">Account Management</router-link>
    </p>
  </v-form>
</template>

<script>
import { isEmpty, cloneDeep } from 'lodash'
import { mapState, mapWritableState, mapActions } from 'pinia'

import AppButton from '@/components/ui/AppButton.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import LicenceHeader from '@/components/licences/LicenceHeader.vue'
import LicenceDetails from '@/components/licences/LicenceDetails.vue'
import ApplicationService from '@/services/applicationService'
import LicenceService from '@/services/licenceService'
import { useApplicationsStore } from '@/stores/applications'
import { APPLICATION_ERROR_MESSAGES, APPLICATION_ROUTES, OFM_PROGRAM_CODES } from '@/utils/constants'
import format from '@/utils/format'
import rules from '@/utils/rules'
import alertMixin from '@/mixins/alertMixin'

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
    facility: {
      type: Object,
      default: () => {
        return {}
      },
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
    }
  },

  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'validation']),
    ...mapWritableState(useApplicationsStore, ['isServiceDeliveryComplete']),
    allLicenceIDs() {
      return this.currentApplication?.licences?.map((licence) => licence.licenceId)
    },

    isLicenceDetailsEditable() {
      return !this.readonly && this.facility?.programCode === OFM_PROGRAM_CODES.CCOF && !this.facility?.facilityReviewComplete && !this.currentApplication?.applicationReviewComplete
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
        this.$router.push({ name: APPLICATION_ROUTES.FACILITY_DETAILS, params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    next: {
      handler() {
        this.$router.push({ name: APPLICATION_ROUTES.OPERATING_COSTS, params: { applicationGuid: this.$route.params.applicationGuid } })
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
        let reloadApplication = this.changedLicences?.length > 0
        const payload = {
          licenceDeclaration: this.licenceDeclaration,
        }
        if (ApplicationService.isApplicationUpdated(payload)) {
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, payload)
          reloadApplication = true
        }

        await Promise.all(
          this.changedLicences.map(async (licence) => {
            this.sanitizeLicenceDetailBeforeSave(licence)
            await LicenceService.updateLicenceDetails(licence.licenceDetailId, licence)
          }),
        )

        if (reloadApplication) {
          await this.getApplication(this.$route.params.applicationGuid)
        }

        this.changedLicences = []

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

    updateLicenceDetails(updatedModel) {
      const clonedModel = cloneDeep(updatedModel)
      clonedModel.updatableOperationFromTime = format.convertTimeToDateTimeFormat(clonedModel.operationFromTime)
      clonedModel.updatableOperationToTime = format.convertTimeToDateTimeFormat(clonedModel.operationToTime)
      clonedModel.weekDays = clonedModel?.weekDays?.toString()
      const index = this.changedLicences.findIndex((el) => el.licenceDetailId == clonedModel.licenceDetailId)
      if (index === -1) {
        this.changedLicences.push(clonedModel)
      } else {
        this.changedLicences[index] = clonedModel
      }
    },

    sanitizeLicenceDetailBeforeSave(detail) {
      if (!LicenceService.isOperationalSpacesValid(detail.operationalSpaces)) {
        delete detail.operationalSpaces
      }
      if (!LicenceService.isEnrolledSpacesValid(detail.enrolledSpaces)) {
        delete detail.enrolledSpaces
      }
      if (!LicenceService.isWeeksInOperationValid(detail.weeksInOperation)) {
        delete detail.weeksInOperation
      }
      if (isEmpty(detail.weekDays)) {
        delete detail.weekDays
      }
      if (isEmpty(detail.operationFromTime)) {
        delete detail.updatableOperationFromTime
      }
      if (isEmpty(detail.operationToTime)) {
        delete detail.updatableOperationToTime
      }
      if (detail.updatableOperationFromTime >= detail.updatableOperationToTime) {
        delete detail.updatableOperationFromTime
        delete detail.updatableOperationToTime
      }
      delete detail.operationFromTime
      delete detail.operationToTime
    },

    setDetailsComplete(licenceId, value) {
      const currentLicence = this.currentApplication?.licences.find((el) => el.licenceId === licenceId)
      currentLicence.isLicenceComplete = value.valid
      this.setFormComplete()
    },

    setFormComplete() {
      this.isServiceDeliveryComplete = this.currentApplication.licences.every((el) => el.isLicenceComplete) && this.licenceDeclaration
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
