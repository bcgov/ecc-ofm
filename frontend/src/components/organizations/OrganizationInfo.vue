<template>
  <v-card class="my-4 pa-4" variant="outlined">
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-row no-gutters>
        <v-col v-if="organizationInfo?.name" cols="12" md="6">
          <v-row no-gutters class="field">
            <v-col cols="12" md="6" class="field-label">Organization legal name:</v-col>
            <v-col cols="12" md="6">{{ organizationInfo?.name }}</v-col>
          </v-row>
        </v-col>
        <v-col v-if="organizationInfo?.emailaddress1" cols="12" md="6">
          <v-row no-gutters class="field">
            <v-col cols="12" md="6" class="field-label">Email address:</v-col>
            <v-col cols="12" md="6">{{ organizationInfo?.emailaddress1 }}</v-col>
          </v-row>
        </v-col>
        <v-col v-if="organizationInfo?.businessType" cols="12" md="6">
          <v-row no-gutters class="field">
            <v-col cols="12" md="6" class="field-label">Doing business as:</v-col>
            <v-col cols="12" md="6">{{ organizationInfo?.businessType }}</v-col>
          </v-row>
        </v-col>
        <v-col v-if="organizationInfo?.phoneLandline" cols="12" md="6">
          <v-row no-gutters class="field">
            <v-col cols="12" md="6" class="field-label">Phone (landline):</v-col>
            <v-col cols="12" md="6">{{ organizationInfo?.phoneLandline }}</v-col>
          </v-row>
        </v-col>
        <v-col v-if="organizationInfo?.phoneCell" cols="12" md="6">
          <v-row no-gutters class="field">
            <v-col cols="12" md="6" class="field-label">Phone (cell):</v-col>
            <v-col cols="12" md="6">{{ organizationInfo?.phoneCell }}</v-col>
          </v-row>
        </v-col>
        <v-col v-if="organizationInfo" cols="12" class="field-label">
          <v-row no-gutters class="field">Address:</v-row>
        </v-col>
        <v-col v-if="organizationInfo?.streetAddress1" cols="12" md="6">
          <v-row no-gutters class="field">
            <v-col cols="12" md="6" class="field-label">Street address 1:</v-col>
            <v-col cols="12" md="6">{{ organizationInfo?.streetAddress1 }}</v-col>
          </v-row>
        </v-col>
        <v-col v-if="organizationInfo?.streetAddress2" cols="12" md="6">
          <v-row no-gutters class="field">
            <v-col cols="12" md="6" class="field-label">Street address 2:</v-col>
            <v-col cols="12" md="6">{{ organizationInfo?.streetAddress2 }}</v-col>
          </v-row>
        </v-col>
        <v-col v-if="organizationInfo?.city" cols="12" md="6">
          <v-row no-gutters class="field">
            <v-col cols="12" md="6" class="field-label">City:</v-col>
            <v-col cols="12" md="6">{{ organizationInfo?.city }}</v-col>
          </v-row>
        </v-col>
        <v-col v-if="organizationInfo?.province" cols="12" md="6">
          <v-row no-gutters class="field">
            <v-col cols="12" md="6" class="field-label">Province:</v-col>
            <v-col cols="12" md="6">{{ organizationInfo?.province }}</v-col>
          </v-row>
        </v-col>
        <v-col v-if="organizationInfo?.postalCode" cols="12" md="6">
          <v-row no-gutters class="field">
            <v-col cols="12" md="6" class="field-label">Postal code:</v-col>
            <v-col cols="12" md="6">{{ organizationInfo?.postalCode }}</v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import alertMixin from '@/mixins/alertMixin'
import OrganizationService from '@/services/organizationService'

export default {
  mixins: [alertMixin],
  data() {
    return {
      organizationInfo: undefined,
      loading: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
  async created() {
    await this.loadOrganizationInfo()
  },
  methods: {
    async loadOrganizationInfo() {
      try {
        this.loading = true
        this.organizationInfo = await OrganizationService.getOrganization(this.userInfo?.organizationId)
        console.log(this.organizationInfo)
      } catch (error) {
        this.setFailureAlert('Failed to get your organization information', error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.field {
  padding: 10px;
}
.field-label {
  font-weight: 700;
}
</style>
