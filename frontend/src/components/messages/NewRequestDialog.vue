<template>
  <v-container>
    <AppDialog v-model="isDisplayed" title="New request" :isLoading="isLoading" persistent max-width="70%" @close="closeNewRequestDialog">
      <template #content>
        <v-form ref="newRequestForm" v-model="isFormComplete" class="px-12 mx-8">
          <v-row no-gutters class="mt-4">
            <v-col class="v-col-12 v-col-md-3 v-col-xl-2 pt-3">
              <AppLabel variant="modal">Topic:</AppLabel>
            </v-col>
            <v-col class="v-col-12 v-col-md-9 v-col-xl-10">
              <v-select
                v-model="newRequestModel.requestCategoryId"
                placeholder="[select a topic]"
                variant="outlined"
                :items="requestCategories"
                item-title="categoryName"
                item-value="categoryId"
                :rules="rules.required"></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-2">
            <v-col class="v-col-12 v-col-md-3 v-col-xl-2 pt-3">
              <AppLabel variant="modal">Subject:</AppLabel>
            </v-col>
            <v-col class="v-col-12 v-col-md-9 v-col-xl-10">
              <v-text-field v-model="newRequestModel.subject" placeholder="Brief summary of request" counter maxlength="100" variant="outlined" :rules="rules.required"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-2">
            <v-col class="v-col-12 pb-0">
              <AppLabel variant="modal">Request description:</AppLabel>
            </v-col>
            <v-col class="v-col-12">
              <v-textarea v-model="newRequestModel.description" placeholder="Detailed description of request" counter maxlength="1000" variant="outlined" :rules="rules.required"></v-textarea>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-2">
            <v-col class="v-col-12 v-col-md-3 v-col-xl-2 pt-3">
              <AppLabel variant="modal">Facility(s):</AppLabel>
            </v-col>
            <v-col class="v-col-12 v-col-md-9 v-col-xl-10">
              <v-select
                id="selectFacility"
                v-model="newRequestModel.facilities"
                placeholder="[selected facility] (add more)"
                variant="outlined"
                chips
                multiple
                :rules="rules.listIsNotEmpty"
                :items="facilities"
                item-title="facilityName"
                return-object></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters align="center">
            <div class="mr-8">
              <AppLabel variant="modal">Supporting documents (optional):</AppLabel>
            </div>
            <AppButton id="upload-document" :primary="false" @click="false">
              <v-icon class="mr-3">mdi-tray-arrow-up</v-icon>
              Upload
            </AppButton>
          </v-row>
          <v-row no-gutters class="mt-2">
            <v-col class="v-col-12 pb-0">
              <AppLabel>Preferred method of contact:</AppLabel>
            </v-col>
            <v-col class="v-col-12">
              <v-radio-group v-model="newRequestModel.contactMethod" :rules="rules.required" inline color="primary">
                <v-radio label="Phone" value="2"></v-radio>
                <v-radio label="Portal message" value="1"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row v-if="newRequestModel.contactMethod === '2'" no-gutters class="mt-2">
            <v-col class="v-col-12 v-col-md-3 v-col-xl-2 pt-3">
              <AppLabel (optional):>Business phone:</AppLabel>
            </v-col>
            <v-col class="v-col-12 v-col-md-9 v-col-xl-10">
              <v-text-field v-model="newRequestModel.phone" variant="outlined" :rules="[...rules.required, rules.phone]" />
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template #button>
        <v-row justify="space-around">
          <AppButton id="cancel-new-request" :primary="false" size="large" width="200px" @click="closeNewRequestDialog()" :loading="isLoading">Cancel</AppButton>
          <AppButton id="submit-new-request" size="large" width="200px" @click="submit()" :loading="isLoading">Submit</AppButton>
        </v-row>
      </template>
    </AppDialog>
    <NewRequestConfirmationDialog :referenceNumber="referenceNumber" :show="showNewRequestConfirmationDialog" @close="toggleNewRequestConfirmationDialog" />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useMessagesStore } from '@/stores/messages'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import rules from '@/utils/rules'
import NewRequestConfirmationDialog from '@/components/messages/NewRequestConfirmationDialog.vue'
import alertMixin from '@/mixins/alertMixin'

export default {
  name: 'NewRequestDialog',
  components: { AppButton, AppDialog, AppLabel, NewRequestConfirmationDialog },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  data() {
    return {
      isFormComplete: false,
      newRequestModel: {},
      rules,
      isDisplayed: false,
      isLoading: false,
      showNewRequestConfirmationDialog: false,
      referenceNumber: '',
    }
  },
  computed: {
    ...mapState(useAppStore, ['requestCategories']),
    ...mapState(useAuthStore, ['currentFacility', 'userInfo']),
    facilities() {
      return this.userInfo?.facilities
    },
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      },
    },
    currentFacility: {
      handler() {
        this.setUpDefaultNewRequestModel()
      },
    },
  },
  created() {
    this.setUpDefaultNewRequestModel()
  },
  methods: {
    ...mapActions(useMessagesStore, ['createAssistanceRequest', 'addNewAssistanceRequestToStore']),

    setUpDefaultNewRequestModel() {
      this.newRequestModel = {
        contactId: this.userInfo?.contactId,
        // Default to the user's current facility
        facilities: [this.facilities?.find((facility) => facility.facilityId === this.currentFacility.facilityId)],
        contactMethod: '1',
        phone: this.userInfo?.phone,
      }
    },

    resetForm() {
      this.$refs.newRequestForm?.reset()
      this.setUpDefaultNewRequestModel()
    },

    closeNewRequestDialog() {
      this.resetForm()
      this.$emit('close')
    },

    async submit() {
      this.$refs.newRequestForm?.validate()
      if (this.isFormComplete) {
        try {
          this.isLoading = true
          const response = await this.createAssistanceRequest(this.newRequestModel)
          this.referenceNumber = response?.referenceNumber
          await this.addNewAssistanceRequestToStore(response?.assistanceRequestId)
          this.toggleNewRequestConfirmationDialog()
        } catch (error) {
          this.setFailureAlert('Failed to create a new assistance request')
          console.log(`Failed to create a new Assistance Request - ${error}`)
          throw error
        } finally {
          this.closeNewRequestDialog()
          this.isLoading = false
        }
      }
    },

    toggleNewRequestConfirmationDialog() {
      this.showNewRequestConfirmationDialog = !this.showNewRequestConfirmationDialog
    },
  },
}
</script>
