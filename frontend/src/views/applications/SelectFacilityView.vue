<template>
  <v-form ref="form" v-model="isFormComplete" class="mx-4">
    <h1>Begin an Operating Funding Model application</h1>
    <div class="mt-8">
      <h4>Organization information</h4>
      <div>
        <v-icon>mdi-information-slab-circle-outline</v-icon>
        Please review the following pre-populated information for correctness and contact your organization's account manager to make updates if required.
      </div>
      <OrganizationInfo />
      <v-checkbox :value="1" :rules="rules.required" label="I confirm that Organization information is correct."></v-checkbox>
    </div>
    <div class="mb-6">
      <h4>To start your application, select a facility</h4>
      <div>
        <v-icon>mdi-information-slab-circle-outline</v-icon>
        If your facility is not listed, contact your Account Manager.
      </div>
      <v-row no-gutters class="mt-4">
        <v-col cols="12" md="4" lg="2">
          <div>Select your facility:</div>
        </v-col>
        <v-col cols="12" md="8" lg="10">
          <v-select
            id="facility"
            v-model="model.facilityId"
            :items="facilities"
            item-title="facilityName"
            item-value="facilityId"
            :rules="rules.required"
            chips
            placeholder="Select facility"
            density="compact"
            variant="outlined"></v-select>
        </v-col>
      </v-row>
    </div>
  </v-form>
</template>

<script>
import { useApplicationsStore } from '@/stores/applications'
import { useAuthStore } from '@/stores/auth'

import { mapState } from 'pinia'
import { APPLICATION_STATUS_CODES } from '@/utils/constants'
import rules from '@/utils/rules'
import OrganizationInfo from '@/components/organizations/OrganizationInfo.vue'
import ApplicationService from '@/services/applicationService'
import alertMixin from '@/mixins/alertMixin'

export default {
  name: 'SelectFacilityView',
  components: { OrganizationInfo },
  mixins: [alertMixin],
  props: {
    cancel: {
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
  emits: ['completeForm', 'process'],
  data() {
    return {
      rules,
      loading: false,
      model: {},
      isFormComplete: false,
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    ...mapState(useAuthStore, ['userInfo']),

    readonly() {
      return this.currentApplication?.statusCode != APPLICATION_STATUS_CODES.DRAFT
    },
    facilities() {
      return this.userInfo?.facilities
    },
  },
  watch: {
    isFormComplete: {
      handler(value) {
        this.$emit('completeForm', value)
      },
    },
    cancel: {
      handler() {
        this.$router.push({ name: 'home' })
      },
    },
    next: {
      async handler() {
        this.$refs.form?.validate()
        if (this.isFormComplete) {
          try {
            this.$emit('process', true)
            const payload = {
              facilityId: this.model.facilityId,
            }
            const response = await ApplicationService.createApplication(payload)
            this.setSuccessAlert('Create a new application sucessfully')
            this.$router.push({ name: 'facility-details', params: { applicationGuid: response?.applicationId } })
          } catch (error) {
            this.setFailureAlert('Failed to create a new application', error)
          } finally {
            this.$emit('process', false)
          }
        }
      },
    },
  },
}
</script>
<style scoped>
:deep(.v-label) {
  opacity: 1;
}
</style>
