<template>
  <v-container>
    <AppDialog
      v-model="isDisplayed"
      :title="dialogTitle"
      persistent
      max-width="70%"
      @closeDialog="closeNewRequestDialog">
      <template #content>
        <v-form ref="newRequestForm" v-model="newRequestModel.isFormComplete" class="px-12 mx-8">
          <v-row no-gutters class="mt-4">
            <v-col class="v-col-12 v-col-md-3 v-col-xl-2 blueText pt-3">
              <strong>Topic:</strong>
            </v-col>
            <v-col class="v-col-12 v-col-md-9 v-col-xl-10">
              <v-select
                v-model="newRequestModel.requestCategoryId"
                placeholder="[select a topic]"
                variant="outlined"
                :items="requestCategories"
                item-title="categoryName"
                item-value="categoryId"
                :rules="rules.required">
              </v-select>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-2">
            <v-col class="v-col-12 v-col-md-3 v-col-xl-2 blueText pt-3">
              <strong>Subject:</strong>
            </v-col>
            <v-col class="v-col-12 v-col-md-9 v-col-xl-10">
              <v-text-field
                v-model="newRequestModel.subject"
                placeholder="Brief summary of request"
                counter maxlength="100"
                variant="outlined"
                :rules="rules.required">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-2">
            <v-col class="v-col-12 blueText pb-0">
              <strong>Request description:</strong>
            </v-col>
            <v-col class="v-col-12">
              <v-textarea
                v-model="newRequestModel.description"
                placeholder="Detailed description of request"
                counter maxlength="1000"
                variant="outlined" :rules="rules.required">
              </v-textarea>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-2">
            <v-col class="v-col-12 v-col-md-3 v-col-xl-2 blueText pt-3">
              <strong>Facility(s):</strong>
            </v-col>
            <v-col class="v-col-12 v-col-md-9 v-col-xl-10">
              <v-select
                v-model="newRequestModel.facilities"
                placeholder="[select facility] (add more)"
                variant="outlined"
                multiple
                :rules="rules.listIsNotEmpty"
                :items="facilities"
                item-title="facilityName"
                item-value="facilityId">
              </v-select>
            </v-col>
          </v-row>
          <v-row no-gutters align="center" class="mt-2">
            <div class="blueText mr-8">
              <strong>Supporting documents</strong> (optional):
            </div>
            <AppButton :isPrimary="false" @click="false">
              <v-icon class="mr-3">mdi-tray-arrow-up</v-icon>Upload
            </AppButton>
          </v-row>
          <v-row no-gutters class="mt-2">
            <v-col class="v-col-12 blueText pb-0">
              <strong>Preferred method of contact:</strong>
            </v-col>
            <v-col class="v-col-12">
              <v-radio-group
                v-model="newRequestModel.contactMethod"
                :rules="rules.required"
                inline
              >
                <v-radio label="Phone" value="2"></v-radio>
                <v-radio label="Portal message" value="1"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row v-if="newRequestModel.contactMethod == '2'" no-gutters class="mt-2">
            <v-col class="v-col-12 v-col-md-3 v-col-xl-2 blueText pt-3">
              <strong>Business Phone:</strong>
            </v-col>
            <v-col class="v-col-12 v-col-md-9 v-col-xl-10">
              <v-text-field
                v-model="newRequestModel.phone"
                variant="outlined" 
                :rules="[...rules.required, rules.phone]"/>
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template #button>
        <v-row justify="space-around">
          <AppButton id="close-new-request" :isPrimary="false" size="large" width="200px" @click="closeNewRequestDialog()" :loading="isLoading">Cancel</AppButton>
          <AppButton id="submit-new-request" size="large" width="200px" @click="submitNewRequest()" :loading="isLoading">Submit</AppButton>
        </v-row>
      </template>
    </AppDialog>
    <NewRequestConfirmationDialog
        :referenceNumber="referenceNumber"
        :showNewRequestConfirmationDialog="showNewRequestConfirmationDialog"
        @closeNewRequestConfirmationDialog="closeNewRequestConfirmationDialog"/>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';
import { useMessagesStore } from '@/stores/messages';
import AppButton from '../ui/AppButton.vue';
import AppDialog from '../ui/AppDialog.vue';
import rules from '@/utils/rules';
import NewRequestConfirmationDialog from '@/components/messages/NewRequestConfirmationDialog.vue';

export default {
  name: 'NewRequestDialog',
  components: { AppButton, AppDialog, NewRequestConfirmationDialog },
  props: {
    showNewRequestDialog: {
      type: Boolean,
      default: false
    },
  },
  emits: ['closeNewRequestDialog'],
  data() {
    return {
      dialogTitle: "New request",
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
      return this.userInfo?.facilityPermission;
    },
  },
  watch: {
    showNewRequestDialog: {
      handler(value) {
        this.isDisplayed = value;
      },
    }
  },
  beforeMount() {
    this.setUpDefaultNewRequestModel();
  },
  methods: {
    ...mapActions(useMessagesStore, ['submitNewAssistanceRequest']),

    setUpDefaultNewRequestModel() {
      this.newRequestModel = {
        contactId: this.userInfo?.contactId,
        facilities: this.facilities?.filter(facility => facility.statusCode === 1),
        contactMethod: "1",
        phone: this.userInfo?.phone,
      };
    },

    resetForm() {
      this.$refs.newRequestForm?.reset();
      this.setUpDefaultNewRequestModel();
    },

    closeNewRequestDialog() {
      this.resetForm();
      this.$emit('closeNewRequestDialog');
    },

    async submitNewRequest() {
      console.log(this.newRequestModel);
      this.$refs.newRequestForm?.validate();
      if (this.newRequestModel?.isFormComplete) {
        try {
          this.isLoading = true
          let response = await this.submitNewAssistanceRequest(this.newRequestModel);
          this.referenceNumber = response?.referenceNumber;
          this.openNewRequestConfirmationDialog();
        } catch (error) {
          console.log(`Failed to create a new Assistance Request - ${error}`);
          throw error;
        } finally {
          this.closeNewRequestDialog()
          this.isLoading = false
        }
      }
    },
    
    openNewRequestConfirmationDialog() {
      this.showNewRequestConfirmationDialog = true;
    },

    closeNewRequestConfirmationDialog() {
      this.showNewRequestConfirmationDialog = false;
    },
  },

}
</script>

<style scoped>
.blueText {
  color: #003366;
  font-size: 125%;
};
</style>
