<template>
  <v-container fluid>
    <h1>Applications</h1>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <div v-if="isEmpty(applications)">You have no applications on file</div>
      <v-data-table v-else :headers="headers" :items="applications" item-key="applicationId" density="compact">
        <template #item.actions="{ item }">
          <router-link :to="{ name: 'home' }">
            {{ getApplicationAction(item) }}
          </router-link>
        </template>
        <template #item.submittedDate="{ item }">
          {{ format.formatDate(item.submittedDate) }}
        </template>
        <template #item.latestActivity="{ item }">
          {{ format.formatDate(item.latestActivity) }}
        </template>
        <template #item.actionButtons="{ item }">
          <v-btn v-if="isApplicationDownloadable(item)" variant="text" @click="false">
            <v-icon icon="fa:fa-regular fa-file-pdf"></v-icon>
          </v-btn>
          <v-btn v-if="isApplicationDeletable(item)" variant="text" @click="false">
            <v-icon icon="fa:fa-regular fa-trash-can"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <AppButton id="back-home-button" :primary="false" size="large" width="200px" :to="{ name: 'home' }">&larr; Back to Home</AppButton>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import AppButton from '@/components/ui/AppButton.vue'
import { useAuthStore } from '@/stores/auth'
import alertMixin from '@/mixins/alertMixin'
import ApplicationService from '@/services/applicationService'
import { isEmpty } from 'lodash'
import format from '@/utils/format'

export default {
  components: { AppButton },
  mixins: [alertMixin],
  data() {
    return {
      format,
      applications: [],
      headers: [
        { title: 'Application ID', key: 'referenceNumber', width: '15%' },
        { title: 'Facility', key: 'facilityName', width: '24%' },
        { title: 'Status', key: 'status', width: '11%' },
        { title: 'Actions', key: 'actions', sortable: false, width: '18%' },
        { title: 'Date submitted', key: 'submittedDate', width: '15%' },
        { title: 'Latest activity', key: 'latestActivity', width: '14%' },
        { title: '', key: 'actionButtons', sortable: false, width: '3%' },
      ],
      loading: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
  async created() {
    try {
      const facilities = this.userInfo?.facilities
      this.loading = true
      await Promise.all(
        facilities?.map(async (facility) => {
          const response = await ApplicationService.getApplicationsByFacilityId(facility.facilityId)
          this.applications = this.applications?.concat(response)
        }),
      )
      ApplicationService.sortApplications(this.applications)
    } catch (error) {
      this.setFailureAlert(`Failed to load applications - ${error}`)
    } finally {
      this.loading = false
    }
  },
  methods: {
    isEmpty,
    getApplicationAction(application) {
      if (application?.status === 'Draft') {
        return 'Continue application'
      }
      return 'View submission'
    },
    isApplicationDeletable(application) {
      return application?.status === 'Draft'
    },
    isApplicationDownloadable(application) {
      return ['Approved', 'Submitted'].includes(application?.status)
    },
  },
}
</script>

<style scoped>
:deep(div.v-data-table-footer) {
  padding-top: 20px;
}
</style>
