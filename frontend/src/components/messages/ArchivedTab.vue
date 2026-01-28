<template>
  <v-row>
    <v-col sm="12" md="6" class="pa-0" :class="borderClass">
      <v-row class="mt-0 ml-0">
        <v-col cols="12">
          <AppButton size="small" class="messages-button mx-1" :primary="false" :disabled="!canModifyMessages" @click="toggleMarkArchivedButton()">
            <v-icon class="mr-1" left>mdi-archive-arrow-up-outline</v-icon>
            <span>Unarchive</span>
          </AppButton>
        </v-col>
      </v-row>
      <v-skeleton-loader :loading="!assistanceRequests" type="table-tbody">
        <AssistanceRequestTable
          :requests="archivedAssistanceRequests"
          :mark-archived-button-state="markArchivedButtonState"
          :unarchive-button-in-conversation-state="unarchiveButtonInConversationState"
          is-archive
          @open-request-conversation="openRequestConversation" />
      </v-skeleton-loader>
    </v-col>
    <v-col sm="12" md="6">
      <RequestConversations :assistance-request-id="selectedAssistanceRequestId" is-archived @toggle-unarchive-button-in-conversation-thread="toggleUnarchiveButtonInConversation" />
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'pinia'
import { useMessagesStore } from '@/stores/messages'
import permissionsMixin from '@/mixins/permissionsMixin'
import AssistanceRequestTable from '@/components/messages/AssistanceRequestTable.vue'
import RequestConversations from '@/components/messages/RequestConversations.vue'

import AppButton from '@/components/ui/AppButton.vue'

export default {
  name: 'MessagesTab',
  components: { AppButton, AssistanceRequestTable, RequestConversations },
  mixins: [permissionsMixin],
  data() {
    return {
      selectedAssistanceRequestId: '',
      markArchivedButtonState: false,
      unarchiveButtonInConversationState: false,
    }
  },
  computed: {
    ...mapState(useMessagesStore, ['assistanceRequests', 'archivedAssistanceRequests']),
    borderClass() {
      return this.$vuetify.display.xs || this.$vuetify.display.sm ? 'border-bottom' : 'border-right'
    },
    canModifyMessages() {
      return this.hasPermission(this.PERMISSIONS.MANAGE_NOTIFICATIONS)
    },
  },
  methods: {
    toggleMarkArchivedButton() {
      this.markArchivedButtonState = !this.markArchivedButtonState
    },
    toggleUnarchiveButtonInConversation() {
      this.unarchiveButtonInConversationState = !this.unarchiveButtonInConversationState
    },
    openRequestConversation(assistanceRequestId) {
      this.selectedAssistanceRequestId = assistanceRequestId
    },
  },
}
</script>

<style scoped>
.border-right {
  border-right: 2px solid #003366;
}

.border-bottom {
  border-bottom: 2px solid #003366;
}

.messages-button {
  display: inline-block;
}

.messages-button:focus {
  outline: 0px !important;
  outline-offset: none !important;
}
</style>
