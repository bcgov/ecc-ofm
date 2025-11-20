<template>
  <v-row>
    <v-col sm="12" md="6" class="pa-0" :class="borderClass">
      <v-row class="mt-0 ml-0">
        <v-col cols="12">
          <AppButton size="small" class="messages-button" :disabled="!canModifyMessages" @click="toggleNewRequestDialog()">
            <v-icon class="mr-1" left>mdi-email-plus-outline</v-icon>
            <span>New message</span>
          </AppButton>
          <AppButton size="small" class="messages-button mx-1" :primary="false" :disabled="!canModifyMessages" @click="toggleMarkUnreadButtonInMessageTable()">
            <v-icon class="mr-1" left>mdi-email-outline</v-icon>
            <span>Mark unread</span>
          </AppButton>
          <AppButton size="small" class="messages-button" :primary="false" :disabled="!canModifyMessages" @click="toggleMarkReadButton()">
            <v-icon class="mr-1" left>mdi-email-open-outline</v-icon>
            <span>Mark read</span>
          </AppButton>
        </v-col>
      </v-row>
      <v-skeleton-loader :loading="!assistanceRequests" type="table-tbody">
        <AssistanceRequestTable
          :mark-read-button-state="markReadButtonState"
          :mark-unread-button-in-message-table-state="markUnreadButtonInMessageTableState"
          :mark-unread-button-in-conversation-thread-state="markUnreadButtonInConversationThreadState"
          @open-request-conversation="openRequestConversation" />
      </v-skeleton-loader>
    </v-col>
    <v-col sm="12" md="6">
      <RequestConversations :assistance-request-id="selectedAssistanceRequestId" @toggle-mark-unread-button-in-conversation-thread="toggleMarkUnreadButtonInConversationThread" />
    </v-col>
  </v-row>
  <NewRequestDialog class="pa-0" :show="showNewRequestDialog" @close="toggleNewRequestDialog" />
</template>

<script>
import { mapState } from 'pinia'
import { useMessagesStore } from '@/stores/messages'
import permissionsMixin from '@/mixins/permissionsMixin'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import AssistanceRequestTable from '@/components/messages/AssistanceRequestTable.vue'
import RequestConversations from '@/components/messages/RequestConversations.vue'

import AppButton from '@/components/ui/AppButton.vue'

export default {
  name: 'MessagesTab',
  components: { AppButton, NewRequestDialog, AssistanceRequestTable, RequestConversations },
  mixins: [permissionsMixin],
  data() {
    return {
      showNewRequestDialog: false,
      selectedAssistanceRequestId: '',
      markReadButtonState: false,
      markUnreadButtonInMessageTableState: false,
      markUnreadButtonInConversationThreadState: false,
    }
  },
  computed: {
    ...mapState(useMessagesStore, ['assistanceRequests']),
    borderClass() {
      return this.$vuetify.display.xs || this.$vuetify.display.sm ? 'border-bottom' : 'border-right'
    },
    canModifyMessages() {
      return this.hasPermission(this.PERMISSIONS.MANAGE_NOTIFICATIONS)
    },
  },
  methods: {
    toggleNewRequestDialog() {
      this.showNewRequestDialog = !this.showNewRequestDialog
    },
    toggleMarkReadButton() {
      this.markReadButtonState = !this.markReadButtonState
    },
    toggleMarkUnreadButtonInMessageTable() {
      this.markUnreadButtonInMessageTableState = !this.markUnreadButtonInMessageTableState
    },
    toggleMarkUnreadButtonInConversationThread() {
      this.markUnreadButtonInConversationThreadState = !this.markUnreadButtonInConversationThreadState
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
