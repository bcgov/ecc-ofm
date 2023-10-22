import { ALERT_NOTIFICATION_TYPES } from '@/utils/constants/AlertNotificationTypes'
import { mapActions } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  data() {
    return {
      alertType: null,
    }
  },
  methods: {
    ...mapActions(useAppStore, ['addAlertNotification']),
    setSuccessAlert(message) {
      this.addAlertNotification({ text: message, alertType: ALERT_NOTIFICATION_TYPES.SUCCESS })
    },
    setFailureAlert(message) {
      this.addAlertNotification({ text: message, alertType: ALERT_NOTIFICATION_TYPES.ERROR })
    },
    setWarningAlert(message) {
      this.addAlertNotification({ text: message, alertType: ALERT_NOTIFICATION_TYPES.WARN })
    },
  },
}
