<template>
  <v-container fluid>
    <h1>Applications</h1>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <div v-if="isEmpty(applications)">You have no applications on file</div>
      <v-data-table v-else :headers="headers" :items="applications" item-key="applicationId" density="compact">
        <template #item.actions="{ item }">
          <router-link :to="getRoutingPath(item?.applicationId)">
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
          <v-btn v-if="isApplicationCancellable(item)" variant="text" @click="toggleCancelDialog(item?.applicationId)">
            <v-icon icon="fa:fa-regular fa-trash-can"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <CancelApplicationDialog :show="showCancelDialog" :applicationId="cancelledApplicationId" @close="toggleCancelDialog" />
    <AppButton id="back-home-button" :primary="false" size="large" width="200px" :to="{ name: 'home' }">&larr; Back to Home</AppButton>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import AppButton from '@/components/ui/AppButton.vue'
import { useApplicationsStore } from '@/stores/applications'
import alertMixin from '@/mixins/alertMixin'
import { isEmpty } from 'lodash'
import format from '@/utils/format'
import CancelApplicationDialog from '@/components/applications/CancelApplicationDialog.vue'
import { PATHS, getApplicationUrl } from '@/services/routingService'

export default {
  components: { AppButton, CancelApplicationDialog },
  mixins: [alertMixin],
  data() {
    return {
      format,
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
      showCancelDialog: false,
      cancelledApplicationId: undefined,
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['applications']),
  },
  async created() {
    try {
      this.loading = true
      await this.getApplications()
    } catch (error) {
      this.setFailureAlert('Failed to get the list of applications')
    } finally {
      this.loading = false
    }
  },
  methods: {
    ...mapActions(useApplicationsStore, ['getApplications']),
    isEmpty,
    getApplicationAction(application) {
      if (application?.status === 'Draft') {
        return 'Continue application'
      }
      return 'View submission'
    },
    isApplicationCancellable(application) {
      return application?.status === 'Draft'
    },
    isApplicationDownloadable(application) {
      return ['Approved', 'Submitted'].includes(application?.status)
    },
    toggleCancelDialog(applicationId = undefined) {
      this.showCancelDialog = !this.showCancelDialog
      this.cancelledApplicationId = applicationId
    },
    getRoutingPath(applicationId) {
      return getApplicationUrl(PATHS.FACILITY_DETAILS, applicationId)
    },
  },
}
</script>

<style scoped>
:deep(div.v-data-table-footer) {
  padding-top: 20px;
}
:deep(.v-data-table-header__content:hover) {
  font-weight: bold;
  color: black;
  cursor: pointer;
}
</style>
