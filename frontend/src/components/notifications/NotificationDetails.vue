<template>
  <v-card v-if="notification" variant="flat">
    <v-card-title class="notification-details-header">
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <strong>From:</strong>
          &nbsp;Operating Funding Model Program
        </div>
        <v-btn v-if="notification?.isRead" class="btn-style" @click="$emit('toggleMarkUnreadButtonInNotificationDetails')">
          <v-icon class="icon" left>mdi-email-outline</v-icon>
          <span class="btn-label">Mark Unread</span>
        </v-btn>
      </div>
      <div class="subject-text">
        {{ notification?.subject }}
      </div>
    </v-card-title>
    <v-card-text v-html="notification?.notificationContent" />
  </v-card>
</template>

<script>
import { mapState } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import alertMixin from '@/mixins/alertMixin'
import format from '@/utils/format'

export default {
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
  border-bottom: 1px solid #6699cc;
  padding-bottom: 6px;
  margin-bottom: 12px;
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

.btn-style:hover .btn-label {
  text-decoration: underline;
}

.btn-style .v-btn__content .icon {
  padding: 0px;
  margin: 0px;
  font-size: 1.5em;
}

.subject-text {
  font-size: 18px;
}
</style>
