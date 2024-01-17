<template>
  <AppDialog v-model="isDisplayed" title="Confirm" :isLoading="isLoading" persistent max-width="25%" @close="closeDialog">
    <template #content>
      <div align="center" class="confirm-dialog-text">A user with this name and email already exists. Are you sure you wish to proceed with this BCeID?</div>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-cancel" size="large" width="250px" :loading="isLoading" @click="closeDialog">Cancel</AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-continue" :primary="false" size="large" width="250px" :loading="isLoading" @click="proceed">Continue</AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import alertMixin from '@/mixins/alertMixin'

export default {
  name: 'DuplicateUserDialog',
  components: { AppButton, AppDialog },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['proceed-confirmed', 'close'],
  data() {
    return {
      isLoading: false,
      isDisplayed: false,
    }
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      },
    },
  },
  methods: {
    proceed() {
      this.$emit('proceed-confirmed')
    },
    closeDialog() {
      this.$emit('close')
    }
  },
}
</script>
