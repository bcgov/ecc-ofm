<template>
  <v-row>
    <v-col sm="12" md="6" class="pa-0" :class="borderClass">
      <v-row>
        <v-col class="mt-3 ml-3">
          <div>
            <AppButton variant="text" @click="toggleNewRequestDialog()">
              <v-icon class="icon" left>mdi-email-plus-outline</v-icon>
              <span class="btn-label">New message</span>
            </AppButton>
            <AppButton variant="text" @click="toggleMarkUnreadButtonInMessageTable()">
              <v-icon class="icon" left>mdi-email-outline</v-icon>
              <span class="btn-label">Mark unread</span>
            </AppButton>
            <AppButton variant="text" class="btn-style" @click="toggleMarkReadButton()">
              <v-icon class="icon" left>mdi-email-open-outline</v-icon>
              <span class="btn-label">Mark read</span>
            </AppButton>
          </div>
        </v-col>
      </v-row>
      <v-skeleton-loader :loading="!assistanceRequests" type="table-tbody">
        <AssistanceRequestTable
          :markReadButtonState="markReadButtonState"
          :markUnreadButtonInMessageTableState="markUnreadButtonInMessageTableState"
          :markUnreadButtonInConversationThreadState="markUnreadButtonInConversationThreadState"
          @openRequestConversation="openRequestConversation" />
      </v-skeleton-loader>
    </v-col>
    <v-col sm="12" md="6">
      <RequestConversations :assistanceRequestId="selectedAssistanceRequestId" @toggleMarkUnreadButtonInConversationThread="toggleMarkUnreadButtonInConversationThread" />
    </v-col>
  </v-row>
  <NewRequestDialog class="pa-0" :show="showNewRequestDialog" :isInvokedFromMessages="true" @close="toggleNewRequestDialog" />
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
</style>
