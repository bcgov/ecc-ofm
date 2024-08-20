<template>
  <v-row>
    <v-col sm="12" md="6" class="pa-0" :class="borderClass">
      <v-row class="mt-0 ml-0">
        <v-col cols="12">
          <AppButton size="small" class="new-message-button" @click="toggleNewRequestDialog()">
            <v-icon left>mdi-email-plus-outline</v-icon>
            New message
          </AppButton>
          <AppButton size="small" style="display: inline-block" :primary="false" class="mx-1" @click="toggleMarkUnreadButtonInMessageTable()">
            <v-icon left>mdi-email-outline</v-icon>
            Mark unread
          </AppButton>
          <AppButton size="small" style="display: inline-block" :primary="false" @click="toggleMarkReadButton()">
            <v-icon left>mdi-email-open-outline</v-icon>
            Mark read
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
  <NewRequestDialog class="pa-0" :show="showNewRequestDialog" :is-invoked-from-messages="true" @close="toggleNewRequestDialog" />
</template>

<script>
import { mapState } from 'pinia'
import { useMessagesStore } from '@/stores/messages'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import AssistanceRequestTable from '@/components/messages/AssistanceRequestTable.vue'
import RequestConversations from '@/components/messages/RequestConversations.vue'

import AppButton from '@/components/ui/AppButton.vue'

export default {
  name: 'MessagesTab',
  components: { AppButton, NewRequestDialog, AssistanceRequestTable, RequestConversations },
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

.new-message-button {
  display: inline-block;
}
</style>
