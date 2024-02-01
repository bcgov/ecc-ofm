<template>
  <v-row>
    <v-col class="ml-6 pr-9 pb-0 d-flex flex-row align-center">
      <h4 class="mr-2">{{ title }}</h4>
      <h5>&nbsp;{{ titleInfo }}</h5>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="ml-6 pr-9 pt-0">
      <v-card elevation="0" variant="outlined">
        <v-expansion-panels variant="accordion" v-model="isPanelOpen">
          <v-expansion-panel elevation="0">
            <v-expansion-panel-title>
              <template v-if="isPanelOpen !== 0">
                {{ `${contacts?.length} ${title}` }}
              </template>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-skeleton-loader :loading="loading" type="table-tbody">
                <div class="w-100">
                  <v-row v-if="editMode">
                    <v-col cols="auto" class="pb-0">
                      <AppLabel>Add {{ title }}:</AppLabel>
                    </v-col>
                    <v-col cols="3" class="pb-0">
                      <v-autocomplete
                        id="additional-contact"
                        ref="autoComplete"
                        v-model="contactId"
                        :items="sortedContactsAvailableForAdd"
                        :disabled="loading"
                        item-title="fullName"
                        item-value="contactId"
                        label="Select contact to add"
                        density="compact"
                        variant="outlined"
                        @update:modelValue="addContact">
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="pt-2">
                      <v-data-table
                        :headers="headers"
                        :items="sortedContacts"
                        density="compact">
                        <template v-slot:item.name="{ item }">
                          {{ `${item.firstName} ${item.lastName}` }}
                        </template>
                        <template v-slot:item.role="{ item }">
                          {{ getRoleNameById(item.role) }}
                        </template>
                        <template v-slot:item.actions="{ item }">
                          <v-row v-if="editMode" justify="end">
                            <v-icon icon="fa:fa-regular fa-trash-can" @click="deleteContact(item)"></v-icon>
                          </v-row>
                        </template>
                        <template v-slot:[`header.actions`]>
                          <v-row v-if="!editMode" justify="end">
                            <v-icon icon="fa:fa-regular fa-edit" @click="toggleEditMode()"></v-icon>
                          </v-row>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                  <v-row v-if="editMode">
                    <v-col cols="12" class="pb-4">
                      <v-row justify="end">
                        <AppButton id="cancel" :primary="false" size="large" :loading="loading" class="mr-6" @click="cancelEditContacts()">Cancel</AppButton>
                        <AppButton id="save" :disabled="isSaveDisabled" :primary="true" size="large" :loading="loading" class="mr-4" @click="saveContactsToUpdate()">Save</AppButton>
                      </v-row>
                    </v-col>
                  </v-row>
                </div>
              </v-skeleton-loader>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import rules from '@/utils/rules'
import { useAppStore } from '@/stores/app'
import { mapState } from 'pinia'

export default {
  name: 'EditFacilityContacts',
  components: { AppButton, AppLabel },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true
    },
    titleInfo: {
      type: String,
      required: true
    },
    contacts: {
      type: Array,
      required: true
    },
    contactsForAdd: {
      type: Array,
      required: true
    },
  },
  emits: ['save-contact-updates'],
  data() {
    return {
      contactId: null,
      contactsToDisplay: [],
      contactsAvailableForAdd: [],
      updatedContactsToAdd: [],
      updatedContactsToRemove: [],
      rules,
      editMode: false,
      isPanelOpen: 0,
      headers: [
        { title: 'Name', value: 'name', width: '20%' },
        { title: 'Role', value: 'role', width: '30%' },
        { title: '', value: 'actions', width: '50%' }
      ],
    }
  },
  computed: {
    ...mapState(useAppStore, ['getRoleNameById']),
    isSaveDisabled() {
      return this.updatedContactsToAdd?.length === 0 && this.updatedContactsToRemove?.length === 0
    },
    sortedContactsAvailableForAdd() {
      return this.sortContacts(this.contactsAvailableForAdd)
    },
    sortedContacts() {
      return this.sortContacts(this.contactsToDisplay)
    },
  },
  watch: {
    contacts: {
      handler: function (val) {
        this.contactsToDisplay = [...val]
      },
      deep: true,
    },
    contactsForAdd: {
      handler: function (val) {
        this.contactsAvailableForAdd = [...val]
      },
      deep: true,
    },
  },
  created() {
    this.facilityId = this.$route.params.facilityId
  },
  methods: {
    /**
     * Toggles edit mode indicator on/off
     */
    toggleEditMode() {
      this.editMode = !this.editMode
    },

    /**
     * Remove focus from the autocomplete input
     * NOTE: This is a workaround for the autocomplete component not triggering update event until the input loses focus.
     */
    removeFocus() {
      const autoComplete = this.$refs.autoComplete;
      if (autoComplete) {
        autoComplete.focus();
        autoComplete.blur();
      }
    },

    /**
     * Add a contact to the list of contacts to display and remove from the list of contacts available for add
     */
    addContact() {
      if (!this.contactId) {
        return
      }
      const contactToAdd = this.contactsAvailableForAdd.find(item => item.contactId === this.contactId)
      this.contactsToDisplay.push(contactToAdd)
      this.updatedContactsToAdd.push(contactToAdd)
      this.contactsAvailableForAdd = this.contactsAvailableForAdd.filter(obj => obj.contactId !== contactToAdd.contactId);
      this.contactId = null
      this.removeFocus()
    },

    /**
     * Remove a contact from the list of contacts to display and add to the list of contacts available for add
     */
    deleteContact(contact) {
      this.contactsToDisplay = this.contactsToDisplay.filter(obj => obj.contactId !== contact.contactId);
      this.updatedContactsToRemove.push(contact)
      this.contactsAvailableForAdd = [...this.contactsAvailableForAdd, contact]
    },

    /**
     * Cancel edit mode and reset the contactId
     */
    cancelEditContacts() {
      this.contactsToDisplay = this.contacts
      this.contactsAvailableForAdd = this.contactsForAdd
      this.updatedContactsToAdd = []
      this.updatedContactsToRemove = []
      this.contactId = null
      this.editMode = false
    },

    /**
     * Send emit to save the updated contacts to add and remove
     */
    saveContactsToUpdate() {
      this.$emit('save-contact-updates', this.updatedContactsToAdd, this.updatedContactsToRemove)
      this.editMode = false
    },

    /**
     * Sort contacts by firstName
     */
    sortContacts(contacts) {
      if (!contacts) {
        return []
      }
      return contacts.sort((a, b) => {
        return a.firstName.localeCompare(b.firstName)
      })
    },
  },
}
</script>
