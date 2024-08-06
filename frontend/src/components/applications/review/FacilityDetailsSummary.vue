<template>
  <v-container fluid class="pa-2 pb-0">
    <h4 class="mb-2">Facility: {{ currentApplication?.facilityName }}</h4>
    <div class="mt-4">
      <h4 class="text-decoration-underline">Locations</h4>
      <FacilityInfo :facility="facility" />
      <div>
        <v-row v-if="currentApplication?.fiscalYearEndDate" no-gutters class="mt-6">
          <AppLabel class="mr-2">What is the end date of your fiscal year?</AppLabel>
          <span>{{ format.formatDate(currentApplication?.fiscalYearEndDate) }}</span>
        </v-row>
        <AppMissingInfoError v-else-if="!readonly" :to="{ name: APPLICATION_ROUTES.FACILITY_DETAILS, hash: '#fiscal-year-end-date', params: { applicationGuid: $route.params.applicationGuid } }">
          {{ APPLICATION_ERROR_MESSAGES.FISCAL_YEAR_END_DATE }}
        </AppMissingInfoError>
      </div>
    </div>
    <div class="mt-4 mb-0">
      <h4 class="text-decoration-underline">Primary Contact</h4>
      <ContactInfo v-if="currentApplication?.primaryContactId" :contact="primaryContact" vCardVariant="flat" class="mt-0 pb-0" />
      <AppMissingInfoError v-else-if="!readonly" :to="{ name: APPLICATION_ROUTES.FACILITY_DETAILS, hash: '#primary-contact', params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.PRIMARY_CONTACT }}
      </AppMissingInfoError>
    </div>
    <hr class="my-4" />
    <div>
      <h4 class="text-decoration-underline">Secondary Contact</h4>
      <ContactInfo v-if="currentApplication?.secondaryContactId" :contact="secondaryContact" vCardVariant="flat" class="mt-0 pb-0" />
      <div v-else class="ma-6">No contact selected</div>
    </div>
    <hr class="my-4" />
    <div>
      <h4 class="text-decoration-underline">Expense Authority</h4>
      <ContactInfo v-if="currentApplication?.expenseAuthorityId" :contact="expenseAuthority" vCardVariant="flat" class="mt-0 pb-0" />
      <AppMissingInfoError v-else-if="!readonly" :to="{ name: APPLICATION_ROUTES.FACILITY_DETAILS, hash: '#expense-authority', params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.EXPENSE_AUTHORITY }}
      </AppMissingInfoError>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import AppLabel from '@/components/ui/AppLabel.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import FacilityInfo from '@/components/facilities/FacilityInfo.vue'
import ContactInfo from '@/components/applications/ContactInfo.vue'
import { useApplicationsStore } from '@/stores/applications'
import { APPLICATION_ERROR_MESSAGES, APPLICATION_ROUTES } from '@/utils/constants'
import format from '@/utils/format'

export default {
  components: { AppLabel, AppMissingInfoError, FacilityInfo, ContactInfo },

  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    facility: {
      type: Object,
      default: () => {
        return {}
      },
    },
    contacts: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    primaryContact() {
      return this.contacts?.find((contact) => contact.contactId === this.currentApplication?.primaryContactId)
    },
    secondaryContact() {
      return this.contacts?.find((contact) => contact.contactId === this.currentApplication?.secondaryContactId)
    },
    expenseAuthority() {
      return this.contacts?.find((contact) => contact.contactId === this.currentApplication?.expenseAuthorityId)
    },
  },

  created() {
    this.format = format
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.APPLICATION_ROUTES = APPLICATION_ROUTES
  },
}
</script>
