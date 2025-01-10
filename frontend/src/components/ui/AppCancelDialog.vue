<template>
  <AppDialog v-model="isDisplayed" title="Cancel Changes" persistent max-width="40%" @close="toggleCancelDialog">
    <template #content>
      <v-row class="mb-2">
        <v-col class="text-center">
          <p class="pt-4 text-h6">Are you sure you want to cancel your changes?</p>
          <p class="pt-4 text-h6">Your progress will not be saved.</p>
        </v-col>
      </v-row>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="keep-change-button" :primary="false" size="large" width="200px" @click="toggleCancelDialog()">
            Keep Changes
          </AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="cancel-change-button" size="large" width="200px" @click="cancelChanges()">
            Cancel Changes
          </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'

export default {
  name: 'AppCancelDialog',
  components: { AppButton, AppDialog },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'cancel'],
  data() {
    return {
      isDisplayed: false
    }
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      }
    }
  },
  methods: {
    toggleCancelDialog() {
      this.$emit('close')
    },

    cancelChanges() {
      this.$emit('cancel')
      this.toggleCancelDialog()
    }
  }
}
</script>
