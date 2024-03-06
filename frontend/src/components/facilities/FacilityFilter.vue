<template>
  <v-row :justify="justify">
    <v-col cols="12" sm="5" md="5" lg="3" xl="3" class="d-flex flex-column align-end">
      <AppButton variant="text" :disabled="loading" @click="toggleShowFilter()">
        Filter by facility
        <v-icon right>mdi-filter</v-icon>
      </AppButton>
    </v-col>
    <v-col cols="12" sm="6" md="6" lg="4" xl="4" class="pb-0">
      <v-text-field v-show="showFilterInput" v-model.trim="facilityNameFilter" placeholder="Filter by facility name" variant="outlined" density="compact" :disabled="loading" hide-details></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'

export default {
  name: 'FacilityFilter',
  components: { AppButton },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    defaultShowInput: {
      type: Boolean,
      default: false,
    },
    justify: {
      type: String,
      default: 'start'
    }
  },
  emits: ['facility-filter-changed'],
  data() {
    return {
      showFilterInput: this.defaultShowInput,
      facilityNameFilter: '',
    };
  },
  watch: {
    facilityNameFilter(newVal) {
      this.$emit('facility-filter-changed', newVal);
    },
  },
  methods: {
    toggleShowFilter() {
      this.showFilterInput = !this.showFilterInput
      if (!this.showFilterInput) {
        this.facilityNameFilter = ''
      }
    },
  },
};
</script>