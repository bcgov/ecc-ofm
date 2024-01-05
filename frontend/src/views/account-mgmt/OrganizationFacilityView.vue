<template>
  <v-container fluid>
    <h1>Update Organization Information</h1>
    <v-row>
      <v-col class="ml-6 mt-6 pb-0">
        <h4>Organization Details</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pt-0">
        <OrganizationInfo class="mt-1" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pt-0 pb-1">
        <h4>Facilities</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="ml-6 pr-9 pt-0">
        <v-card class="pa-6" variant="outlined">
          <v-skeleton-loader :loading="loading" type="table-tbody">
            <v-row>
              <v-col cols="11">
                <v-card v-for="(item, index) in this.facilities"
                  :to="{ name: 'facility', params: { facilityId: item.facilityId } }"
                  :key="index"
                  clickable
                  hover
                  class="facility-card mr-4">{{ item.name }}</v-card>
              </v-col>
              <v-col cols="1">
                <v-row justify="end">
                  <v-icon icon="fa:fa-regular fa-plus" class="mr-4"></v-icon>
                  <v-icon icon="fa:fa-regular fa-trash-can"></v-icon>
                </v-row>
              </v-col>
            </v-row>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AppButton :primary="false" size="large" width="400px" :to="{ name: 'account-mgmt' }">&larr; Back to Account Management</AppButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import OrganizationInfo from '@/components/organizations/OrganizationInfo.vue'
import OrganizationService from '@/services/OrganizationService'
import alertMixin from '@/mixins/alertMixin'
import { mapState } from 'pinia'

import { useAuthStore } from '@/stores/auth'

export default {
  name: 'OrganizationFacilityView',
  components: { AppButton, OrganizationInfo },
  mixins: [alertMixin],
  data() {
    return {
      facilities: undefined,
      loading: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
  created() {
    this.loadFacilities()
  },
  methods: {
    /**
     * Loads the facilities for the organization
     */
    async loadFacilities() {
      try {
        this.loading = true
        this.facilities = await OrganizationService.getOrganizationFacilities(this.userInfo.organizationId)
      } catch (error) {
        this.setFailureAlert('Failed to get facilities for organizationId = ' + this.userInfo.organizationId, error)
      } finally {
        this.loading = false
      }
    },
  },

}
</script>

<style>
.facility-card {
  display: inline-block;
  vertical-align: top;
  max-width: 375px;
  width: auto;
  min-width: 0;
  height: auto;
  padding: 8px;
  border: 1px solid black;
  box-shadow: none;
  margin-right: 4px;
}
</style>
