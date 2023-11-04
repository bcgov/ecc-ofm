<template>
  <AppDialog v-model="isDisplayed" :title="dialogTitle" persistent max-width="40%" @closeDialog="closeDialog">
    <template #content>
      <v-row>
        <v-col align="center">
          <p class="pt-4">Your message has been submitted.</p>
          <p class="pt-4">Reference: {{ referenceNumber }}</p>
          <p class="pt-4">Typical response times are 3-5 business days.</p>
        </v-col>
      </v-row>
    </template>
    <template #button>
      <v-row justify="space-around">
        <AppButton id="return-home-button" :isPrimary="false" size="large" width="200px" @click="returnToHome()">Return to home</AppButton>
        <AppButton id="view-message-button" size="large" width="200px" @click="viewMessages()">View messages</AppButton>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '../ui/AppButton.vue'
import AppDialog from '../ui/AppDialog.vue'
import { PATHS } from '@/utils/constants'

export default {
  name: 'NewRequestConfirmationDialog',
  components: { AppButton, AppDialog },
  props: {
    showNewRequestConfirmationDialog: {
      type: Boolean,
      default: false,
    },
    referenceNumber: {
      type: String,
      default: '',
    },
  },
  emits: ['closeNewRequestConfirmationDialog'],
  data() {
    return {
      isDisplayed: false,
      dialogTitle: 'Success',
    }
  },
  watch: {
    showNewRequestConfirmationDialog: {
      handler(value) {
        this.isDisplayed = value
      },
    },
  },
  methods: {
    returnToHome() {
      this.closeDialog()
      this.$router.push(PATHS.HOME)
    },
    viewMessages() {
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('closeNewRequestConfirmationDialog')
    },
  },
}
</script>
