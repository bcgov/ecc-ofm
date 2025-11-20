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
    </v-card-title>

    <v-card-text class="notification-content" v-html="notification?.notificationContent" />
  </v-card>
</template>

<script>
import { mapState } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import format from '@/utils/format'
import AppButton from '@/components/ui/AppButton.vue'

export default {
  components: { AppButton },
  mixins: [alertMixin, permissionsMixin],
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
    canModifyMessages() {
      return this.hasPermission(this.PERMISSIONS.MANAGE_NOTIFICATIONS)
    },
  },
  watch: {
    // When notificationId changes, get the details for that notification.
    notificationId(newVal) {
      this.notification = this.notifications.find((item) => item.notificationId === newVal)
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
