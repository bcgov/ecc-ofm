<template>
  <v-container>
    <AppDialog v-model="isDisplayed" title="Request ????????" persistent max-width="70%" @close="closeNewRequestDialog">
      <template #content>
        <v-form ref="newRequestForm" v-model="newRequestModel.isFormComplete" class="px-12 mx-8">
          <v-row no-gutters class="mt-2">
            <v-col class="v-col-12 blue-text pb-0">
              <strong>Reply to request:</strong>
            </v-col>
            <v-col class="v-col-12">
              <v-textarea v-model="newRequestModel.description" placeholder="Enter message text" counter
                maxlength="1000" variant="outlined" :rules="rules.required"></v-textarea>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end mt-0">
            <AppButton id="upload-document" :primary="false" @click="false" class="mt-0">
              <v-icon class="mr-3">mdi-tray-arrow-up</v-icon>
              Add files (optional)
            </AppButton>
          </v-row>
        </v-form>
      </template>
      <template #button>
        <v-row justify="space-around mt-6">
          <AppButton id="cancel-new-request" :primary="false" size="large" width="200px" @click="closeNewRequestDialog()"
            :loading="isLoading">Cancel</AppButton>
          <AppButton id="submit-new-request" size="large" width="200px" @click="submit()" :loading="isLoading">Submit
          </AppButton>
        </v-row>
      </template>
    </AppDialog>
    <NewRequestConfirmationDialog :referenceNumber="referenceNumber" :show="showNewRequestConfirmationDialog"
      @close="toggleNewRequestConfirmationDialog" />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useMessagesStore } from '@/stores/messages'
import AppButton from '../ui/AppButton.vue'
import AppDialog from '../ui/AppDialog.vue'
import rules from '@/utils/rules'
import NewRequestConfirmationDialog from '@/components/messages/NewRequestConfirmationDialog.vue'

export default {
  name: 'NewRequestDialog',
  components: { AppButton, AppDialog, NewRequestConfirmationDialog },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  data() {
    return {
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
    ...mapState(useAuthStore, ['userInfo']),
    facilities() {
      return this.userInfo?.facilityPermission
    },
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      },
    },
  },
  created() {
    this.setUpDefaultNewRequestModel()
  },
  methods: {
    ...mapActions(useMessagesStore, ['createNewAssistanceRequest']),

    setUpDefaultNewRequestModel() {
      this.newRequestModel = {
        contactId: this.userInfo?.contactId,
        facilities: this.facilities?.filter((facility) => facility.facilityStateCode === 0), // statecode: 0 = Active, 1 = Inactive
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
      if (this.newRequestModel?.isFormComplete) {
        try {
          this.isLoading = true
          let response = await this.createNewAssistanceRequest(this.newRequestModel)
          this.referenceNumber = response?.referenceNumber
          this.toggleNewRequestConfirmationDialog()
        } catch (error) {
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

<style scoped>
.blue-text {
  color: #003366;
  font-size: 125%;
}
</style>
