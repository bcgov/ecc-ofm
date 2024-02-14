<template>
  <v-container fluid class="pa-2 pb-0">
    <h4 class="mb-2">Facility: {{ currentApplication?.facilityName }}</h4>
    <div class="mt-4">
      <h4 class="text-decoration-underline">Locations</h4>
      <FacilityInfo :facility="facility" />
    </div>
    <div class="mt-4 mb-0">
      <h4 class="text-decoration-underline">Primary Contact</h4>
      <ContactInfo v-if="currentApplication?.primaryContactId" :contact="primaryContact" vCardVariant="flat" class="mt-0 pb-0" />
      <AppMissingInfoError v-else :to="{ name: 'facility-details', hash: '#primary-contact', params: { applicationGuid: $route.params.applicationGuid } }">
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
      <AppMissingInfoError v-else :to="{ name: 'facility-details', hash: '#expense-authority', params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.EXPENSE_AUTHORITY }}
      </AppMissingInfoError>
    </div>
  </v-container>
</template>

<script>
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import FacilityInfo from '@/components/facilities/FacilityInfo.vue'
import ContactInfo from '@/components/applications/ContactInfo.vue'
import { APPLICATION_ERROR_MESSAGES } from '@/utils/constants'

export default {
  components: { AppMissingInfoError, FacilityInfo, ContactInfo },
  props: {
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
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
  },
}
</script>
