<template>
  <v-row no-gutters justify="end">
    <v-col cols="12" sm="5" lg="3" class="d-flex flex-column align-end">
      <AppButton id="status-filter-button" variant="text" :disabled="loading" class="pt-2" @click="toggleShowFilter()">
        Filter by Status
        <v-icon>mdi-filter</v-icon>
      </AppButton>
    </v-col>
    <v-col cols="12" sm="6" lg="4" class="pb-0">
      <v-text-field v-show="showFilterInput" v-model.trim="statusFilter" placeholder="Filter by Status" variant="outlined" density="compact" :disabled="loading" hide-details />
    </v-col>
  </v-row>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'

export default {
  name: 'StatusFilter',
  components: { AppButton },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['status-filter-changed'],
  data() {
    return {
      showFilterInput: true,
      statusFilter: '',
    }
  },
  watch: {
    statusFilter(newVal) {
      this.$emit('status-filter-changed', newVal)
    },
  },
  methods: {
    toggleShowFilter() {
      this.showFilterInput = !this.showFilterInput
      if (!this.showFilterInput) {
        this.statusFilter = ''
      }
    },
  },
}
</script>
