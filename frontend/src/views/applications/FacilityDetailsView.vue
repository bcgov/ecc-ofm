<template>
  <v-form ref="form" v-model="isFormComplete">
    <div>
      <h4>Facility Information</h4>
      <FacilityInfo :facility="currentApplication?.facility" />
      <v-row no-gutters class="my-6">
        <AppLabel class="pt-7 mr-4">What is the end date of your fiscal year?</AppLabel>
        <AppDateInput
          id="fiscal-year-end-date"
          v-model="fiscalYearEndDate"
          :rules="[...rules.required, rules.MMDDYYYY]"
          :disabled="readonly"
          :hide-details="readonly"
          label="Fiscal Year End Date"
          class="mt-3" />
      </v-row>
    </div>
    <FacilityLocationAttributes
      id="location-attributes"
      :facility="currentApplication?.facility"
      :readonly="readonly"
      @update="updateFacilityLocationAttributes" />
    <div id="primary-contact" class="mt-8">
      <h4>Primary Contact</h4>
      <p>
        <v-icon>mdi-information-slab-circle-outline</v-icon>
        If your contact is not on this list, contact your organization Account Manager.
      </p>
      <v-card class="mt-2 pa-4" variant="outlined">
        <v-row no-gutters class="mt-4">
          <v-col cols="12" md="6" lg="5" xl="4" class="mb-4 pr-4">
            <AppLabel>Choose a primary contact for this application:</AppLabel>
          </v-col>
          <v-col cols="12" md="6" lg="7" xl="8">
            <v-select
              id="select-primary-contact"
              v-model="primaryContact"
              :items="contacts"
              :disabled="readonly"
              :hide-details="readonly"
              item-title="fullName"
              item-value="contactId"
              label="Select Primary Contact"
              :rules="rules.required"
              density="compact"
              variant="outlined"
              return-object></v-select>
          </v-col>
        </v-row>
        <ContactInfo v-if="primaryContact" :contact="primaryContact" />
      </v-card>
    </div>
    <div id="secondary-contact" class="mt-8">
      <h4>Secondary Contact (Recommended)</h4>
      <p>
        <v-icon>mdi-information-slab-circle-outline</v-icon>
        This is a backup contact in case the primary cannot be reached.
      </p>
      <v-card class="mt-2 pa-4" variant="outlined">
        <v-row no-gutters class="mt-4">
          <v-col cols="12" md="6" lg="5" xl="4" class="mb-4 pr-4">
            <AppLabel>Choose a secondary contact for this application:</AppLabel>
          </v-col>
          <v-col cols="12" md="6" lg="7" xl="8">
            <v-select
              id="select-secondary-contact"
              v-model="secondaryContact"
              :items="availableSecondaryContacts"
              :disabled="readonly"
              :hide-details="readonly"
              item-title="fullName"
              label="Select Secondary Contact"
              density="compact"
              variant="outlined"
              clearable
              return-object></v-select>
          </v-col>
        </v-row>
        <ContactInfo v-if="secondaryContact" :contact="secondaryContact" />
      </v-card>
    </div>
    <div id="expense-authority" class="mt-8">
      <h4>Expense Authority</h4>
      <p>
        <v-icon>mdi-information-slab-circle-outline</v-icon>
        This person may be the same as your primary or secondary contact.
      </p>
      <v-card class="mt-2 pa-4" variant="outlined">
        <v-row no-gutters class="mt-4">
          <v-col cols="12" md="6" lg="5" xl="4" class="mb-4 pr-4">
            <AppLabel>Choose an expense authority for this application:</AppLabel>
          </v-col>
          <v-col cols="12" md="6" lg="7" xl="8">
            <v-select
              id="select-expense-authority"
              v-model="expenseAuthority"
              :items="availableExpenseAuthorities"
              :disabled="readonly"
              :hide-details="readonly"
              item-title="fullName"
              label="Select Expense Authority"
              :rules="rules.required"
              density="compact"
              variant="outlined"
              return-object></v-select>
          </v-col>
        </v-row>
        <ContactInfo v-if="expenseAuthority" :contact="expenseAuthority" />
      </v-card>
    </div>
  </v-form>
</template>

<script>
import { mapState, mapWritableState, mapActions } from 'pinia'

import AppDateInput from '@/components/ui/AppDateInput.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import FacilityLocationAttributes from '@/components/facilities/FacilityLocationAttributes.vue'
import FacilityInfo from '@/components/facilities/FacilityInfo.vue'
import ContactInfo from '@/components/applications/ContactInfo.vue'
import ApplicationService from '@/services/applicationService'
import FacilityService from '@/services/facilityService'
import { useApplicationsStore } from '@/stores/applications'
import { APPLICATION_ROUTES } from '@/utils/constants'
import format from '@/utils/format'
import rules from '@/utils/rules'
import alertMixin from '@/mixins/alertMixin'

export default {
  name: 'FacilityDetailsView',
  components: { AppDateInput, AppLabel, FacilityLocationAttributes, FacilityInfo, ContactInfo },
  mixins: [alertMixin],

  async beforeRouteLeave(_to, _from, next) {
    if (!this.readonly) {
      await this.saveApplication()
    }
    next(!this.processing) // only go to the next page after saveApplication is complete
  },

  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    back: {
      type: Boolean,
      default: false,
    },
    next: {
      type: Boolean,
      default: false,
    },
    save: {
      type: Boolean,
      default: false,
    },
    contacts: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['process'],

  data() {
    return {
      rules,
      isFormComplete: false,
      processing: false,
      primaryContact: undefined,
      secondaryContact: undefined,
      expenseAuthority: undefined,
      fiscalYearEndDate: null,
      updatedFacilityLocationAttributes: null,
    }
  },

  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'validation']),
    ...mapWritableState(useApplicationsStore, ['isFacilityDetailsComplete']),
    // The primary contact cannot be the same as the secondary contact
    availableSecondaryContacts() {
      return this.contacts?.filter((contact) => contact?.contactId != this.primaryContact?.contactId)
    },
    availableExpenseAuthorities() {
      return this.contacts?.filter((contact) => contact?.isExpenseAuthority)
    },
    isFacilityLocationAttributesUpdated() {
      return (
        this.updatedFacilityLocationAttributes?.k12SchoolGrounds !==
          this.currentApplication?.facility?.k12SchoolGrounds ||
        this.updatedFacilityLocationAttributes?.municipalCommunity !==
          this.currentApplication?.facility?.municipalCommunity ||
        this.updatedFacilityLocationAttributes?.onReserve !== this.currentApplication?.facility?.onReserve ||
        this.updatedFacilityLocationAttributes?.yppDesignation !== this.currentApplication?.facility?.yppDesignation ||
        this.updatedFacilityLocationAttributes?.yppEnrolled !== this.currentApplication?.facility?.yppEnrolled ||
        this.updatedFacilityLocationAttributes?.personalResidence !==
          this.currentApplication?.facility?.personalResidence
      )
    },
  },

  watch: {
    isFormComplete: {
      handler(value) {
        this.isFacilityDetailsComplete = value
      },
    },
    back: {
      handler() {
        this.$router.push({ name: 'applications-history' })
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    next: {
      async handler() {
        await this.$refs.form?.validate()
        if (!this.isFormComplete) return
        this.$router.push({
          name: APPLICATION_ROUTES.ELIGIBILITY,
          params: { applicationGuid: this.$route.params.applicationGuid },
        })
      },
    },
    primaryContact: {
      handler() {
        if (this.secondaryContact?.contactId != this.primaryContact?.contactId) return
        this.secondaryContact = undefined
      },
    },
  },

  created() {
    this.$emit('process', false)
    this.fiscalYearEndDate = this.currentApplication?.fiscalYearEndDate
    this.primaryContact = this.contacts?.find(
      (contact) => contact.contactId === this.currentApplication?.primaryContactId,
    )
    this.secondaryContact = this.contacts?.find(
      (contact) => contact.contactId === this.currentApplication?.secondaryContactId,
    )
    this.expenseAuthority = this.contacts?.find(
      (contact) => contact.contactId === this.currentApplication?.expenseAuthorityId,
    )
  },

  async mounted() {
    if (this.validation) {
      await this.$refs.form?.validate()
    }
  },

  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),

    async saveApplication(showAlert = false) {
      try {
        this.$emit('process', true)
        this.processing = true
        let reloadApplication = false
        const payload = {
          primaryContactId: this.primaryContact?.contactId ? this.primaryContact?.contactId : null,
          secondaryContactId: this.secondaryContact?.contactId ? this.secondaryContact?.contactId : null,
          expenseAuthorityId: this.expenseAuthority?.contactId ? this.expenseAuthority?.contactId : null,
          // XXX - CRM date object uses PST timezone, so we need to convert our date to PST before sending it to CRM
          fiscalYearEndDate: this.fiscalYearEndDate ? format.convertUTCDatetoPSTDate(this.fiscalYearEndDate) : null,
        }
        if (this.isFacilityLocationAttributesUpdated) {
          reloadApplication = true
          await FacilityService.updateFacility(
            this.currentApplication?.facility?.facilityId,
            this.updatedFacilityLocationAttributes,
          )
        }
        if (ApplicationService.isApplicationUpdated(payload)) {
          reloadApplication = true
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, payload)
        }
        if (reloadApplication) {
          await this.getApplication(this.$route.params.applicationGuid)
        }
        if (showAlert) {
          this.setSuccessAlert('Application saved successfully')
        }
      } catch (error) {
        this.setFailureAlert('Failed to save your application', error)
      } finally {
        this.$emit('process', false)
        this.processing = false
      }
    },

    updateFacilityLocationAttributes(updatedFacility) {
      this.updatedFacilityLocationAttributes = {
        k12SchoolGrounds: updatedFacility?.k12SchoolGrounds,
        municipalCommunity: updatedFacility?.municipalCommunity,
        onReserve: updatedFacility?.onReserve,
        yppDesignation: updatedFacility?.yppDesignation,
        yppEnrolled: updatedFacility?.yppDesignation ? updatedFacility?.yppEnrolled : null,
        personalResidence: updatedFacility?.personalResidence,
      }
    },
  },
}
</script>
