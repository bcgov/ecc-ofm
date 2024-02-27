<template>
  <v-container fluid class="pt-0">
    <h3 class="header-application justify-sm-start justify-md-end">{{ currentApplication?.referenceNumber }}</h3>
  </v-container>
</template>
<script>
import { mapState } from 'pinia'
import { useApplicationsStore } from '@/stores/applications'

export default {
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
  },
}
</script>
<style scoped>
.header-application {
  display: flex;
  color: #003366;
}
</style>
