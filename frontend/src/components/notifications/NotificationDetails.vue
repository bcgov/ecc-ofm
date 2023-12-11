<template>
  <v-card v-if="notification" variant="flat">
    <v-card-title class="notification-details-header">
      <v-row>
        <v-col sm="12" lg="9" xl="10" class="from-text pa-0">
          <strong>From:</strong>
          &nbsp;Operating Funding Model Program
        </v-col>
        <v-col sm="12" lg="3" xl="2" class="pa-0 d-flex justify-end mt-1">
          <AppButton v-if="notification?.isRead" variant="text" @click="$emit('toggleMarkUnreadButtonInNotificationDetails')">
            <v-icon class="icon" left>mdi-email-outline</v-icon>
            <span class="btn-label">Mark Unread</span>
          </AppButton>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="subject-text">
            {{ notification?.subject }}
          </div>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text v-html="notification?.notificationContent" />
  </v-card>
</template>

<script>
import { mapState } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import alertMixin from '@/mixins/alertMixin'
import format from '@/utils/format'
import AppButton from '@/components/ui/AppButton.vue'

export default {
  components: { AppButton },
  mixins: [alertMixin],
  format: [format],
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
    }
  },
  computed: {
    ...mapState(useNotificationsStore, ['notifications']),
  },
  watch: {
    // When notificationId changes, get the details for that notification.
    notificationId(newVal) {
      this.notification = this.notifications.find((item) => item.notificationId === newVal)
    },
  },
}
</script>

<style scoped>
.notification-details-header {
  border-bottom: 1px solid #003366;
  padding-bottom: 6px;
  margin-bottom: 12px;
}

.notification-button {
  display: flex;
  justify-content: end;
}

.from-text {
  white-space: pre-wrap;
}

.subject-text {
  font-size: 1.1rem;
  white-space: pre-wrap;
}
</style>
