<template>
  <v-container fluid>
    <h1>Facility Details</h1>
    <div>This page is {{ readonly ? 'READ-ONLY' : 'EDITABLE' }}</div>
  </v-container>
</template>

<script>
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import { APPLICATION_STATUS_CODES } from '@/utils/constants'

export default {
  name: 'FacilityDetailsView',
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    readonly() {
      return this.currentApplication?.statusCode != APPLICATION_STATUS_CODES.DRAFT
    },
  },
}
</script>
