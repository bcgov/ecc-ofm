<template>
  <v-container fluid>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-data-table :headers="headers" :items="pendingReports" item-key="reportId" :items-per-page="15" density="compact">
        <template #[`item.alertType`]="{ item }">
          <v-icon v-if="item.alertType === 'Due'" color="#c48600" size="34" title="Due">mdi-alert</v-icon>
          <v-icon v-else-if="item.alertType === 'Overdue'" color="error" size="34" title="Overdue">mdi-alert-octagon</v-icon>
        </template>
        <template #[`item.status`]="{ item }">
          <span :class="getStatusClass(item.statusCode)" class="pt-1 pb-1 pl-2 pr-2">{{ item.status }}</span>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn v-if="isApplicationDownloadable(item)" variant="text" @click="false">
            <v-icon icon="fa:fa-regular fa-file-pdf"></v-icon>
          </v-btn>
          <v-btn v-if="isApplicationCancellable(item)" variant="text" @click="toggleCancelDialog(item)">
            <v-icon icon="fa:fa-regular fa-trash-can"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import alertMixin from '@/mixins/alertMixin'
import { isEmpty } from 'lodash'
import format from '@/utils/format'
import { mapState, mapActions } from 'pinia'

export default {
  mixins: [alertMixin],
  props: {
    pendingReports: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      format,
      headers: [
        { title: 'Alert', key: 'alertType' },
        { title: 'Report ID', key: 'surveyResponseId' },
        { title: 'Title', key: 'title' },
        { title: 'Facility', key: 'facilityName' },
        { title: 'Status', key: 'status' },
        { title: 'Latest Activity', key: 'lastActivityDate' },
        { title: 'Actions', key: 'actions' },
      ],
    }
  },
  computed: {},
  async created() {},
  methods: {},
}
</script>

<style scoped>
.soft-outline {
  border: 1px solid #dee2e6 !important;
}

.status-gray {
  background-color: #e0e0e0;
  border-radius: 5px;
}

.status-green {
  background-color: #c8e6c9;
  border-radius: 5px;
}

.status-blue {
  background-color: #bbdefb;
  border-radius: 5px;
}

.status-yellow {
  background-color: #ffe082;
  border-radius: 5px;
}
</style>
