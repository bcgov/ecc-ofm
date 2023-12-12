<template>
  <v-container fluid>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <router-view></router-view>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useApplicationsStore } from '@/stores/applications'
import alertMixin from '@/mixins/alertMixin'

export default {
  name: 'ApplicationView',
  mixins: [alertMixin],
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
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
