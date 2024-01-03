<template>
  <v-container fluid>
    <h1>Update Facility Information</h1>
    <v-row>
      <v-col class="ml-6 mt-6 pb-0">
        <h4>Facility Details</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pt-0">
        <FacilityInfo :facilityId="facilityId" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6">
        <h4>Licenses</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="ml-6 pr-9 pt-0">
        <v-card class="pa-6" variant="outlined">
          Licenses
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6">
        <h4>Expense Authority</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="ml-6 pr-9 pt-0">
        <v-card class="pa-6" variant="outlined">
          Expense Authority
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6">
        <h4>Primary Contact</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="ml-6 pr-9 pt-0">
        <v-card class="pa-6 mb-3" variant="outlined">
          Primary Contact
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <v-row>
          <AppButton id="back-to-account-mgmt" :primary="false" size="medium" width="400px" :to="{ name: 'account-mgmt' }">&larr; Back to Account Management</AppButton>
        </v-row>
      </v-col>
      <v-col cols="2">
        <v-row>
          <AppButton id="cancel" :primary="true" size="large" :to="{ name: 'organization-facility' }" class="mr-6">Cancel</AppButton>
          <AppButton id="save" :primary="true" size="large" :to="{ name: 'account-mgmt' }">Save</AppButton>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import FacilityInfo from '@/components/facilities/FacilityInfo.vue'
import FacilityService from '@/services/facilityService'
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'FacilityView',
  components: { AppButton, AppLabel, FacilityInfo },
  data() {
    return {
      facilityId: null,
      facilityContacts: undefined,
      loading: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
  created() {
    this.facilityId = this.$route.params.facilityId
    this.loadFacilityContacts()
  },
  methods: {
    async loadFacilityContacts() {
      try {
        this.loading = true
        this.facilityContacts = await FacilityService.getFacilityContacts(this.facilityId)
      } catch (error) {
        this.setFailureAlert('Failed to get Primary and Expense Authority contacts for facilityId = ' + this.facilityId, error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style></style>
