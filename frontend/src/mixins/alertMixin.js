import { mapActions } from 'pinia'

import { appStore } from '@/store/modules/app'
import { ALERT_NOTIFICATION_TYPES } from '@/utils/constants/AlertNotificationTypes'

export default {
  data() {
    return {
      alertType: null,
    }
  },
  methods: {
    ...mapActions(appStore, ['addAlertNotification']),
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
