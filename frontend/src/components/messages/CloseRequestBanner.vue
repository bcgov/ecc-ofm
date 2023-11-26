<template>
  <v-container>
    <v-alert icon="mdi-information-slab-circle-outline" density="compact" prominent variant="outlined">
      <v-row no-gutters>
        <v-col cols="12" lg="8" xl="9">
          <div class="text-body-1">Has this request been resolved?</div>
          <div class="text-body-2">After 21 of inactivity, this request will be closed automatically</div>
        </v-col>
        <v-col cols="12" lg="4" xl="3" align="right">
          <AppButton id="close-request" @click="openConfirmDialog">Close request</AppButton>
        </v-col>
      </v-row>
    </v-alert>
    <AppDialog v-model="showConfirmDialog" title="Confirm" persistent max-width="50%" @close="closeConfirmDialog">
      <template #content>
        <div align="center" class="confirm-dialog-text">Are you sure you want to close this request?</div>
      </template>
      <template #button>
        <v-row class="mt-2" justify="space-around">
          <AppButton id="go-back" :primary="false" size="large" width="200px" @click="closeConfirmDialog" :loading="isLoading">Go back</AppButton>
          <AppButton id="close-request" size="large" width="200px" @click="closeAssistanceRequest" :loading="isLoading">Close request</AppButton>
        </v-row>
      </template>
    </AppDialog>
  </v-container>
</template>
<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import { ASSISTANCE_REQUEST_STATUS_CODES } from '@/utils/constants'

export default {
  components: { AppButton, AppDialog },
  props: {
    assistanceRequestId: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      showConfirmDialog: false,
      isLoading: false,
    }
  },
  methods: {
    closeConfirmDialog() {
      this.showConfirmDialog = false
    },
    openConfirmDialog() {
      this.showConfirmDialog = true
    },
    async closeAssistanceRequest() {
      this.isLoading = true
      const payload = {
        statusCode: ASSISTANCE_REQUEST_STATUS_CODES.CLOSED_COMPLETE,
      }
      await this.updateAssistanceRequest(this.assistanceRequestId, payload)
      this.closeConfirmDialog()
      this.isLoading = false
    },
  },
}
</script>
<style scoped>
.v-alert {
  border-color: #003466;
  background-color: #d4eaff;
}

:deep(.mdi-information-slab-circle-outline) {
  color: #003466;
}

.confirm-dialog-text {
  margin: 12px 0px;
  font-size: 1.5em;
}
</style>
