<template>
  <FacilityFilter class="mb-8" :default-show-input="true" justify="end" @facility-filter-changed="facilityFilterChanged" />
  <v-data-table
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="filteredFacilities"
    item-key="facilityId"
    :items-per-page="10"
    density="compact"
    :mobile="null"
    mobile-breakpoint="md"
    class="soft-outline">
    <template #[`item.contactId`]="{ item }">
      <v-row no-gutters class="my-2 align-center justify-end justify-md-start">
        <AppButton :primary="false" size="small" @click="navigateToFacility(item.facilityId)">Open</AppButton>
      </v-row>
    </template>
    <template #[`item.primaryContactName`]="{ item }">
      <v-row no-gutters class="my-2 align-center justify-end justify-md-start">
        <v-icon v-if="!item.primaryContactName" color="amber" class="mr-2">mdi-alert</v-icon>
        <p v-else>{{ item.primaryContactName }}</p>
      </v-row>
    </template>
    <template #[`item.expenseAuthorityName`]="{ item }">
      <v-row no-gutters class="my-2 align-center justify-end justify-md-start">
        <v-icon v-if="!item.expenseAuthorityName" color="amber" class="mr-2">mdi-alert</v-icon>
        <p v-else>{{ item.expenseAuthorityName }}</p>
      </v-row>
    </template>
  </v-data-table>
</template>

<script>
import { isEmpty } from 'lodash'
import AppButton from '@/components/ui/AppButton.vue'
import FacilityFilter from '@/components/facilities/FacilityFilter.vue'

export default {
  name: 'ManageFacilityTable',
  components: { AppButton, FacilityFilter },
  inheritAttrs: true,
  props: {
    facilities: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      sortBy: [
        { key: 'primaryContactName', order: 'asc' },
        { key: 'expenseAuthorityName', order: 'asc' },
      ],
      headers: [
        { title: 'Facility Name', key: 'facilityName' },
        { title: 'Facility Address', key: 'address' },
        { title: 'Primary Contact', key: 'primaryContactName' },
        { title: 'Expense Authority', key: 'expenseAuthorityName' },
        { title: 'Actions', key: 'contactId', sortable: false },
      ],
      updatedValue: null,
      facilityNameFilter: undefined,
    }
  },
  computed: {
    filteredFacilities() {
      return isEmpty(this.facilityNameFilter) ? this.facilities : this.facilities?.filter((facility) => facility.facilityName?.toLowerCase().includes(this.facilityNameFilter?.toLowerCase()))
    },
  },
  methods: {
    /**
     * Facility filter component value changed.
     */
    facilityFilterChanged(newVal) {
      this.facilityNameFilter = newVal
    },
    /**
     * Navigates to the Manage Facility page
     */
    navigateToFacility(facilityId) {
      this.$router.push({ name: 'manage-facility', params: { facilityId } })
    },
  },
}
</script>
