<template>
  <v-container fluid>
    <h1>Facility Details</h1>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <div>This page is {{ readonly ? 'READ-ONLY' : 'EDITABLE' }}</div>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { useApplicationsStore } from '@/stores/applications'
import { mapState, mapActions } from 'pinia'
import { APPLICATION_STATUS_CODES } from '@/utils/constants'

export default {
  name: 'FacilityDetails',
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    readonly() {
      return this.currentApplication?.statusCode != APPLICATION_STATUS_CODES.DRAFT
    },
  },
  async created() {
    try {
      if (this.currentApplication?.applicationId === this.$route.params.applicationGuid) return
      this.loading = true
      await this.getApplication(this.$route.params.applicationGuid)
    } catch (error) {
      this.setFailureAlert('Failed to load the application')
    } finally {
      this.loading = false
    }
  },
  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),
  },
}
</script>
