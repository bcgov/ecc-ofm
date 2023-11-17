<template>
  <v-container fluid class="pa-3">
    <v-row>
      <v-col cols="6" class="border-right pa-0">
        <v-row>
          <v-col class="mt-1">
            <div class="flex-item">
              <v-btn class="btn-style" @click="toggleNewRequestDialog()">
                <v-icon class="icon" left>mdi-email-plus-outline</v-icon>
                <span class="btn-label">New message</span>
              </v-btn>
              <v-btn class="btn-style" @click="toggleMarkUnreadButtonInMessageTable()">
                <v-icon class="icon" left>mdi-email-outline</v-icon>
                <span class="btn-label">Mark unread</span>
              </v-btn>
              <v-btn class="btn-style" @click="toggleMarkReadButton()">
                <v-icon class="icon" left>mdi-email-open-outline</v-icon>
                <span class="btn-label">Mark read</span>
              </v-btn>
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
      <v-col cols="6">
        <RequestConversations
          :assistanceRequestId="selectedAssistanceRequestId"
          @toggleMarkUnreadButtonInConversationThread="toggleMarkUnreadButtonInConversationThread" />
      </v-col>
    </v-row>
    <NewRequestDialog class="pa-0" :show="showNewRequestDialog" @close="toggleNewRequestDialog" />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import AssistanceRequestTable from '@/components/messages/AssistanceRequestTable.vue'
import RequestConversations from '@/components/messages/RequestConversations.vue'
export default {
  name: 'MessagesTab',
  components: { NewRequestDialog, AssistanceRequestTable, RequestConversations },
  data() {
    return {
      showNewRequestDialog: false,
      selectedAssistanceRequestId: null,
      markReadButtonState: false,
      markUnreadButtonInMessageTableState: false,
      markUnreadButtonInConversationThreadState: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useMessagesStore, ['assistanceRequests']),
  },
  async created() {
    if (!this.assistanceRequests) await this.getAssistanceRequests(this.userInfo?.contactId)
  },
  methods: {
    ...mapActions(useMessagesStore, ['getAssistanceRequests']),
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
  border-right: 2px solid #6699cc;
}

.flex-item {
  display: flex;
  align-items: left;
}

.btn-style:hover .btn-label {
  text-decoration: underline;
}

.btn-style {
  padding: 0px 6px;
  margin: 0px;
  font-size: 14px;
  background-color: #ffffff;
  color: #6699cc;
  font-weight: bold;
  text-transform: none;
  max-height: 28px;
  border: none;
  box-shadow: none;
}

.btn-style:hover {
  background-color: #ffffff;
}

.btn-style .v-btn__content .icon {
  padding: 0px;
  margin: 0px;
  font-size: 1.5em;
}
</style>