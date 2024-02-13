<template>
  <v-form ref="form" v-model="isFormComplete">
    <div>
      <h4 class="my-4">
        Your facility:
        <span class="facility-name ml-6">{{ currentApplication?.facilityName }}</span>
      </h4>
    </div>
    <div>
      <h4>Facility Information</h4>
      <FacilityInfo :loading="loading" :facility="facility" />
    </div>
    <div class="mt-8">
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
              :disabled="readonly || loading"
              item-title="fullName"
              label="Select Primary Contact"
              :rules="rules.required"
              density="compact"
              variant="outlined"
              return-object></v-select>
          </v-col>
        </v-row>
        <ContactInfo v-if="primaryContact" :loading="loading" :contact="primaryContact" />
      </v-card>
    </div>
    <div class="mt-8">
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
              :disabled="readonly || loading"
              item-title="fullName"
              label="Select Secondary Contact"
              density="compact"
              variant="outlined"
              clearable
              return-object></v-select>
          </v-col>
        </v-row>
        <ContactInfo v-if="secondaryContact" :loading="loading" :contact="secondaryContact" />
      </v-card>
    </div>
    <div class="mt-8">
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
              :disabled="readonly || loading"
              item-title="fullName"
              label="Select Expense Authority"
              :rules="rules.required"
              density="compact"
              variant="outlined"
              return-object></v-select>
          </v-col>
        </v-row>
        <ContactInfo v-if="expenseAuthority" :loading="loading" :contact="expenseAuthority" />
      </v-card>
    </div>
  </v-form>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import { useApplicationsStore } from '@/stores/applications'
import { useAppStore } from '@/stores/app'
import { mapState, mapWritableState, mapActions } from 'pinia'
import { APPLICATION_STATUS_CODES } from '@/utils/constants'
import rules from '@/utils/rules'
import FacilityInfo from '@/components/facilities/FacilityInfo.vue'
import ContactInfo from '@/components/applications/ContactInfo.vue'
import ApplicationService from '@/services/applicationService'
import FacilityService from '@/services/facilityService'
import alertMixin from '@/mixins/alertMixin'

export default {
  name: 'FacilityDetailsView',
  components: { AppLabel, FacilityInfo, ContactInfo },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (this.loading) return
    if (!this.readonly) {
      await this.saveApplication()
    }
    next()
  },
  props: {
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
  },
  emits: ['process'],
  data() {
    return {
      rules,
      model: {},
      isFormComplete: false,
      facility: undefined,
      contacts: [],
      loading: false,
      primaryContact: undefined,
      secondaryContact: undefined,
      expenseAuthority: undefined,
    }
  },
  computed: {
    ...mapState(useAppStore, ['getRoleNameById']),
    ...mapState(useApplicationsStore, ['currentApplication']),
    ...mapWritableState(useApplicationsStore, ['isFacilityDetailsComplete']),
    readonly() {
      return this.currentApplication?.statusCode != APPLICATION_STATUS_CODES.DRAFT
    },
    // The primary contact cannot be the same as the secondary contact
    availableSecondaryContacts() {
      return this.contacts?.filter((contact) => contact?.contactId != this.primaryContact?.contactId)
    },
    availableExpenseAuthorities() {
      return this.contacts?.filter((contact) => contact?.isExpenseAuthority)
    },
  },
  watch: {
    isFormComplete: {
      handler(value) {
        if (this.loading) return
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
      handler() {
        this.$router.push({ name: 'service-delivery', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
    primaryContact: {
      handler() {
        if (this.secondaryContact?.contactId != this.primaryContact?.contactId) return
        this.secondaryContact = undefined
      },
    },
  },
  async created() {
    await this.loadData()
    this.primaryContact = this.contacts?.find((contact) => contact.contactId === this.currentApplication?.primaryContactId)
    this.secondaryContact = this.contacts?.find((contact) => contact.contactId === this.currentApplication?.secondaryContactId)
    this.expenseAuthority = this.contacts?.find((contact) => contact.contactId === this.currentApplication?.expenseAuthorityId)
  },
  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),

    async loadData() {
      try {
        this.$emit('process', true)
        this.loading = true
        await Promise.all([this.getFacility(), this.getContacts()])
      } finally {
        this.loading = false
        this.$emit('process', false)
      }
    },

    async getContacts() {
      try {
        this.contacts = await FacilityService.getContacts(this.currentApplication?.facilityId)
        this.contacts?.forEach((contact) => {
          contact.fullName = `${contact.firstName} ${contact.lastName}`
          contact.roleName = this.getRoleNameById(Number(contact.role))
        })
      } catch (error) {
        this.setFailureAlert('Failed to get contacts for facilityId = ' + this.currentApplication?.facilityId, error)
      }
    },

    async getFacility() {
      try {
        this.facility = await FacilityService.getFacility(this.currentApplication?.facilityId)
      } catch (error) {
        this.setFailureAlert('Failed to get Facility information for facilityId = ' + this.currentApplication?.facilityId, error)
      }
    },

    async saveApplication(showAlert = false) {
      try {
        this.$emit('process', true)
        const payload = {
          primaryContactId: this.primaryContact?.contactId ? this.primaryContact?.contactId : null,
          secondaryContactId: this.secondaryContact?.contactId ? this.secondaryContact?.contactId : null,
          expenseAuthorityId: this.expenseAuthority?.contactId ? this.expenseAuthority?.contactId : null,
        }
        if (ApplicationService.isApplicationUpdated(payload)) {
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, payload)
          await this.getApplication(this.$route.params.applicationGuid)
        }
        if (showAlert) {
          this.setSuccessAlert('Application saved successfully')
        }
      } catch (error) {
        this.setFailureAlert('Failed to save your application', error)
      } finally {
        this.$emit('process', false)
      }
    },
  },
}
</script>
<style scoped>
.facility-name {
  color: #003366;
  font-size: 1.3em;
  text-decoration: underline;
}
</style>
