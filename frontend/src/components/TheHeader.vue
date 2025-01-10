<template>
  <v-app-bar color="#003366" class="px-5 px-md-10 sys-bar" :height="height">
    <!-- Navbar content -->
    <v-container :fluid="true">
      <v-row>
        <v-col cols="12" sm="6" md="7" lg="8" class="d-flex pl-0 py-0 py-sm-3">
          <router-link tabindex="-1" :to="{ name: 'home' }">
            <img tabindex="-1" src="@/assets/images/bc-gov-logo.svg" class="logo" alt="B.C. Government Logo" />
          </router-link>
          <v-row class="vertical-line my-auto">
            <v-row class="my-auto">
              <v-toolbar-title fill-height class="toolbar-title">
                <h2 class="main-title">{{ appTitle }}</h2>
              </v-toolbar-title>
            </v-row>
          </v-row>
        </v-col>
        <v-col
          v-if="showMenu"
          cols="12"
          sm="6"
          md="5"
          lg="4"
          class="d-flex align-center justify-center justify-sm-end px-2 py-2 py-sm-3"
          :class="iconsClass">
          <div>
            <v-row class="align-center">
              <v-col v-if="showMessagingIcon" style="width: 70px">
                <div>
                  <v-btn
                    v-if="!isNaN(messageNotificationCount)"
                    id="mail_box_button"
                    aria-label="Messages/Notifications"
                    rounded
                    @click="$router.push({ name: 'messaging' })">
                    <v-badge
                      color="error"
                      class="pt-0"
                      :content="messageNotificationCount"
                      bottom
                      right
                      overlap
                      offset-x="8"
                      offset-y="28">
                      <v-icon aria-hidden="false" icon="mdi-email-outline" size="40" color="white" />
                    </v-badge>
                  </v-btn>
                  <v-skeleton-loader v-else type="chip" class="chip-loader" />
                </div>
              </v-col>
              <v-col class="px-0" style="width: 50px">
                <v-btn id="help_button" aria-label="Help" rounded @click="$router.push({ name: 'help' })">
                  <v-icon aria-hidden="false" icon="mdi-help-circle-outline" size="38" color="white" />
                </v-btn>
              </v-col>
              <v-col class="px-0" style="width: 50px">
                <v-btn id="home_button" aria-label="Home" rounded @click="$router.push({ name: 'home' })">
                  <v-icon aria-hidden="false" icon="mdi-home-outline" size="40" color="white" />
                </v-btn>
              </v-col>
              <v-col class="px-0">
                <v-menu name="user_options" offset-y>
                  <template #activator="{ props }">
                    <v-chip v-bind="props" tabindex="0" pill color="#003366" dark class="mt-1" aria-label="User Menu">
                      <v-icon aria-hidden="false" icon="mdi-account-circle" size="35" color="white" />
                      <span class="display-name pl-1 pt-0 mt-0">{{ userInfo.displayName }}</span>
                    </v-chip>
                  </template>
                  <v-list style="background-color: #003366; color: white">
                    <v-list-item
                      v-if="isMinistryUser"
                      id="impersonate_button"
                      class="user-link"
                      :to="{ name: 'impersonate' }"
                      title="Impersonate" />
                    <v-list-item id="logout_button" class="user-link" :href="logoutPath" title="Log Out" />
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import permissionsMixin from '@/mixins/permissionsMixin'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import { useNotificationsStore } from '@/stores/notifications'
import { AuthRoutes } from '@/utils/constants'

export default {
  name: 'TheHeader',
  mixins: [permissionsMixin],
  computed: {
    ...mapState(useAuthStore, ['userInfo', 'isAuthenticated', 'isMinistryUser']),
    ...mapState(useMessagesStore, ['assistanceRequests', 'unreadMessageCount']),
    ...mapState(useNotificationsStore, ['unreadNotificationCount']),
    appTitle() {
      return import.meta.env.VITE_APP_TITLE || '$10 a Day ChildCareBC Centres'
    },
    height() {
      return this.$vuetify.display.xs && this.showMenu ? 140 : 64
    },
    messageNotificationCount() {
      return this.actionRequiredAndUnreadMessageCount + this.unreadNotificationCount
    },
    // count of requests that are unread or are in the status of “Action required”
    actionRequiredAndUnreadMessageCount() {
      const readActionRequiredMessagesCount = this.assistanceRequests?.filter(
        (message) => message.status === 'Action required' && message.isRead,
      )?.length
      return this.unreadMessageCount + readActionRequiredMessagesCount
    },
    showMenu() {
      return this.isAuthenticated && this.userInfo
    },
    showMessagingIcon() {
      return this.isAuthenticated && this.userInfo && this.hasPermission(this.PERMISSIONS.MANAGE_NOTIFICATIONS)
    },
    logoutPath() {
      return this.isMinistryUser ? AuthRoutes.LOGOUT_IDIR : AuthRoutes.LOGOUT
    },
    iconsClass() {
      return this.$vuetify.display.xs ? 'icons-border' : ''
    },
  },
  watch: {
    userInfo: {
      handler(_value) {
        this.loadUserInfo()
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions(useMessagesStore, ['getAssistanceRequests']),
    ...mapActions(useNotificationsStore, ['getNotifications']),
    async loadUserInfo() {
      try {
        if (this.showMessagingIcon) {
          await this.getNotifications(this.userInfo?.contactId)
          await this.getAssistanceRequests(this.userInfo?.contactId)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
.chip-loader {
  background-color: #003366;
  width: 80px;
}
.v-chip:hover {
  background-color: rgb(255, 255, 255, 0.05);
}

.user-link:hover {
  color: #ffffff;
}

.logo {
  padding-right: 15px;
  padding-top: 4px;
  width: 205px;
  height: 77px;
}

.logout {
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
}

.logout-link {
  text-decoration: underline;
  font-size: 1rem;
  line-height: 2.25rem;
  color: #ffffff;
  cursor: pointer;
  opacity: 1;
}

.logout-link:hover {
  text-decoration: none;
}

.vertical-line {
  border-left: 1px solid #dfb433;
  height: 50px;
  margin-left: 12px;
  padding-left: 24px;
}

.sys-bar {
  border-bottom: 2px solid rgb(252, 186, 25) !important;
  z-index: 1002;
}

.display-name {
  color: white;
}

.main-title {
  color: #ffffff;
}

.icons-border {
  border-top: 1px solid #ffffff;
}

.toolbar-title {
  font-size: 14px;
}

@media screen and (max-width: 959px) {
  .logo {
    width: 100px;
  }

  .main-title {
    font-size: 1rem;
  }

  .display-name {
    display: none;
  }
}
</style>
