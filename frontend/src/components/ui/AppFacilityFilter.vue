<template>
  <v-col cols="auto">
    <AppButton variant="text" :disabled="loading" @click="toggleShowFilter()">
      Filter by facility
      <v-icon right>mdi-filter</v-icon>
    </AppButton>
  </v-col>
  <v-col cols="3" class="pb-0">
    <v-text-field v-if="showFilterInput" v-model.trim="facilityNameFilter" placeholder="Filter by facility name" variant="outlined" density="compact" :disabled="loading"></v-text-field>
  </v-col>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'

export default {
  components: { AppButton },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    defaultShowFilterInput: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['facility-filter-changed'],
  data() {
    return {
      showFilterInput: false,
      facilityNameFilter: '',
    };
  },
  watch: {
    facilityNameFilter(newVal) {
      this.$emit('facility-filter-changed', newVal);
    },
  },
  created() {
    this.showFilterInput = this.defaultShowFilterInput
  },
  methods: {
    toggleShowFilter() {
      if (this.showFilterInput) {
        this.showFilterInput = false
        this.facilityNameFilter = ''
      } else {
        this.showFilterInput = true
      }
    },
  },
};
</script>