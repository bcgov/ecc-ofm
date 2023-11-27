<template>
  <AppDialog v-model="isDisplayed" title="Success" persistent max-width="40%" @close="closeDialog">
    <template #content>
      <v-row class="mb-2">
        <v-col align="center">
          <p class="pt-4 text-h6">Your message has been submitted.</p>
          <p class="pt-4 text-h6">Reference: {{ referenceNumber }}</p>
          <p class="pt-4 text-h6">Typical response times are 3-5 business days.</p>
        </v-col>
      </v-row>
    </template>
    <template #button>
      <v-row justify="space-around">
        <AppButton id="return-home-button" :primary="false" size="large" width="200px" :to="{ name: 'home' }">Return to home</AppButton>
        <AppButton id="view-messages-button" size="large" width="200px" @click="closeDialog()">View messages</AppButton>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'

export default {
  name: 'NewRequestConfirmationDialog',
  components: { AppButton, AppDialog },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    referenceNumber: {
      type: String,
      default: '',
    },
  },
  emits: ['close'],
  data() {
    return {
      isDisplayed: false,
    }
  },
  computed: {},
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      },
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
  },
}
</script>
