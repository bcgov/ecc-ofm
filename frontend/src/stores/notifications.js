/* TODO: This file was brought across from STUDENT-ADMIN with some uncertainty  as to whether common framework functionality.
   Not sure but it appears maybe more business specific than general system notifications. Remove file from code base if its
   purpose was business specific to STUDENT-ADMIN.
*/

import { defineStore } from 'pinia'

/* TODO: If file is indeed common functionality (i.e. see header comment), then uncomment during integration with backend...
import { appStore } from '@/store/modules/app';
*/

export const useNotificationsStore = defineStore('notifications', {
  namespaced: true,
  state: () => ({
    notification: null,
    notifications: []
  }),
  actions: {
    async changeNotification(payload) {
      this.notification = payload
      this.notifications.push(payload)
    },
    async setNotification(payload) {
      try {
        const notificationData = JSON.parse(payload)
        await this.changeNotification(notificationData)
        /* TODO: If file is indeed common functionality (i.e. see header comment), then following is example usage with backend...
        if (notificationData && notificationData.sagaName?.startsWith('PEN_SERVICES_') && notificationData.sagaStatus === 'COMPLETED' && notificationData.studentID) {
          await studentStore().resetStudentInProcessStatus(notificationData.studentID);
        } else if(notificationData && notificationData.eventType === 'COPY_USERS_TO_NEW_SCHOOL' && notificationData.eventOutcome === 'USERS_TO_NEW_SCHOOL_COPIED'){
          await appStore().refreshEntities();
        }
        */
      } catch (e) {
        console.error(e)
      }
    }
  }
})
