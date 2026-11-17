<!-- eslint-disable vue/no-v-html -->
<template>
  <v-card v-if="notification" variant="flat">
    <v-card-title class="notification-details-header">
      <v-row>
        <v-col cols="7" md="8" lg="9" class="notification-from-text pa-0">
          <strong>From:</strong>
          &nbsp;$10 a Day Funding Program
        </v-col>
        <v-col cols="5" md="4" lg="3" class="pa-0 d-flex justify-end mt-1">
          <AppButton
            v-if="notification?.isRead"
            size="small"
            class="notifications-button"
            :primary="false"
            :disabled="!canModifyMessages"
            @click="$emit('toggleMarkUnreadButtonInNotificationDetails')">
            <v-icon class="mr-1" left>mdi-email-outline</v-icon>
            <span>Mark Unread</span>
          </AppButton>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="notification-subject-text">
            {{ notification?.subject }}
          </div>
        </v-col>
      </v-row>
      <v-row v-if="isLookingUpDocuments">
        <v-col>
          <v-skeleton-loader type="list-item-two-line" />
        </v-col>
      </v-row>
      <v-row v-if="hasDocuments" class="my-5">
        <v-expansion-panels v-model="panel">
          <v-expansion-panel title="Attachments">
            <v-expansion-panel-text>
              <v-data-table v-model:sort-by="sortBy" hide-default-footer :headers="attachmentHeaders" :items="loadedAttachments" item-key="documentId" class="data-table">
                <template #[`item.fileName`]="{ item }">
                  <a href="#" @click="getFile(item)">{{ item.fileName }}</a>
                </template>
                <template #[`item.lastUpdatedTime`]="{ item }">{{ format.formatDateToLocale(item?.lastUpdatedTime || notification.dateReceived) }}</template>
              </v-data-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-card-title>
    <v-card-text class="notification-content" v-html="notificationHtml" />
  </v-card>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import DocumentService from '@/services/documentService'
import alertMixin from '@/mixins/alertMixin'
import format from '@/utils/format'
import permissionsMixin from '@/mixins/permissionsMixin'
import { createFileDownloadLink } from '@/utils/common'
import { mapState } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'

export default {
  components: { AppButton },
  mixins: [alertMixin, permissionsMixin],
  props: {
    notificationId: {
      type: String,
      required: true,
      default: '',
    },
  },
  emits: ['toggleMarkUnreadButtonInNotificationDetails'],
  data() {
    return {
      format,
      notification: null,
      isLookingUpDocuments: false,
      isSortedDesc: true,
      panel: [],
      sortBy: [{ key: 'lastUpdatedTime', order: 'desc' }],
      attachmentHeaders: [
        { title: 'File Name', key: 'fileName' },
        { title: 'Uploaded On', key: 'lastUpdatedTime' },
      ],
      loadedAttachments: [],
    }
  },
  computed: {
    ...mapState(useNotificationsStore, ['notifications']),
    canModifyMessages() {
      return this.hasPermission(this.PERMISSIONS.MANAGE_NOTIFICATIONS)
    },
    hasDocuments() {
      return this.loadedAttachments.length > 0
    },
    notificationHtml() {
      const content = this.notification?.notificationContent
      if (!content) return ''
      const doc = new DOMParser().parseFromString(content, 'text/html')
      doc.querySelectorAll('table, tr, th, td').forEach((el) => this.removeTableInlineStyles(el))
      const topLevelTables = [...doc.querySelectorAll('table')].filter((table) => !table.parentElement?.closest('table'))
      topLevelTables.forEach((table, index) => this.wrapTableInScrollRegion(doc, table, index))
      return doc.body.innerHTML
    },
  },
  watch: {
    // When notificationId changes, get the details for that notification.
    notificationId: async function (newVal) {
      this.notification = this.notifications.find((item) => item.notificationId === newVal)
      this.panel = []
      this.isLookingUpDocuments = true
      this.loadedAttachments = []
      const docPromises = [await DocumentService.getAttachments(newVal), await DocumentService.getSharedDocuments(newVal)]
      await Promise.all(docPromises)
      this.loadedAttachments = DocumentService.sortDocuments([...docPromises[0], ...docPromises[1]])
      this.isLookingUpDocuments = false
    },
  },
  methods: {
    async getFile(document) {
      try {
        const getter = document.type === 'attachment' ? DocumentService.getAttachmentByID : DocumentService.getDocumentFileByID
        const file = await getter(document.documentId)
        createFileDownloadLink(file, document.fileName)
      } catch (e) {
        console.error(e)
        this.setFailureAlert('Error downloading file. Please wait a few minutes before you try again.')
      }
    },
    removeTableInlineStyles(el) {
      ;['border', 'padding', 'background', 'width', 'display'].forEach((prop) => el.style.removeProperty(prop))
      ;['border', 'bgcolor', 'width', 'cellpadding'].forEach((attr) => el.removeAttribute(attr))
    },
    wrapTableInScrollRegion(doc, table, index) {
      const wrapper = doc.createElement('div')
      wrapper.className = 'notification-table-scroll'
      wrapper.setAttribute('tabindex', '0')
      wrapper.setAttribute('role', 'region')
      wrapper.setAttribute('aria-label', `Scrollable table ${index + 1}`)
      table.before(wrapper)
      wrapper.appendChild(table)
    },
  },
}
</script>

<style>
.notification-details-header {
  border-bottom: 1px solid #003366;
  padding-bottom: 6px;
  margin-bottom: 12px;
}

.notification-button {
  display: flex;
  justify-content: end;
}

.notification-content * {
  font-family: 'BCSans', Verdana, Arial, sans-serif !important;
  font-size: 16px;
}

.notification-table-scroll {
  width: fit-content;
  max-width: 100%;
  overflow-x: auto;
  margin: 4px 0;
}

.notification-table-scroll:focus-visible {
  outline: 2px solid #003366;
  outline-offset: 2px;
}

.notification-content table {
  border-collapse: collapse;
}

.notification-content table * {
  font-size: 14px;
}

.notification-content th,
.notification-content td {
  border: 1px solid #e0e0e0;
  padding: 8px 12px;
  background-color: transparent;
}

.notification-from-text {
  white-space: pre-wrap;
}

.notification-subject-text {
  font-size: 1.1rem;
  white-space: pre-wrap;
}

.notifications-button:focus {
  outline: 0px !important;
  outline-offset: none !important;
}
</style>
