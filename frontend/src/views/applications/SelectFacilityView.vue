<template>
  <v-form ref="form" v-model="isFormComplete" class="mx-4">
    <h1>Begin an Operating Funding Model application</h1>
    <div class="mt-8">
      <h4>Organization information</h4>
      <div>
        <v-icon class="mr-1">mdi-information-slab-circle-outline</v-icon>
        <span>Please review the following pre-populated information for correctness and contact your organization's account manager to make updates if required.</span>
      </div>
      <OrganizationInfo />
      <v-checkbox :value="1" :rules="rules.required" label="I confirm that Organization information is correct."></v-checkbox>
    </div>
    <div class="mb-6">
      <h4>To start your application, select a facility</h4>
      <div>
        <v-icon class="mr-1">mdi-information-slab-circle-outline</v-icon>
        <span>If your facility is not listed, contact your Account Manager.</span>
      </div>
      <v-row no-gutters class="mt-4">
        <v-col cols="12" md="4" lg="2">
          <div>Select your facility:</div>
        </v-col>
        <v-col cols="12" md="8" lg="10">
          <v-select
            id="facility"
            v-model="facilityId"
            :items="userInfo?.facilities"
            item-title="facilityName"
            item-value="facilityId"
            :rules="rules.required"
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

import { mapState, mapActions } from 'pinia'
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
      facilityId: undefined,
      isFormComplete: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
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
        if (!this.isFormComplete) return
        try {
          this.$emit('process', true)
          const payload = {
            facilityId: this.facilityId,
          }
          const response = await ApplicationService.createApplication(payload)
          await this.getApplication(response?.applicationId)
          this.setSuccessAlert('Started a new application successfully')
          this.$router.push({ name: 'facility-details', params: { applicationGuid: response?.applicationId } })
        } catch (error) {
          this.setFailureAlert('Failed to start a new application', error)
        } finally {
          this.$emit('process', false)
        }
      },
    },
  },
  created() {
    if (this.userInfo?.facilities?.length === 1) {
      this.facilityId = this.userInfo?.facilities[0].facilityId
    }
  },
  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),
  },
}
</script>
<style scoped>
:deep(.v-label) {
  opacity: 1;
}
</style>
