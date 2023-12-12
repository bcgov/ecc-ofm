<template>
  <v-app-bar color="rgb(0, 51, 102)" class="pl-10 pr-10 sysBar" style="z-index: 1002">
    <!-- Navbar content -->
    <v-container class="ma-0" :class="{ sizingForIconXLScreen: xl }" style="width: 100%" :fluid="true">
      <v-row class="justify-space-between">
        <a tabindex="-1" href="/">
          <img tabindex="-1" src="@/assets/images/bc-gov-logo.svg" class="logo" alt="B.C. Government Logo" />
        </a>
        <v-row class="verticalLine my-auto">
          <v-row class="my-auto">
            <v-toolbar-title fill-height style="font-size: 14px">
              <h6 v-if="xs"><span v-html="appTitleXs" /></h6>
              <h2 class="mainTitle" v-else>{{ appTitle }}</h2>
            </v-toolbar-title>
          </v-row>
        </v-row>
        <v-spacer></v-spacer>
        <div v-if="isAuthenticated && userInfo" class="mt-5">
          <v-row>
            <v-col style="width: 70px">
              <v-btn @click="$router.push({ name: 'messaging' })" id="mail_box_button" rounded class="mr-5 elevation-0" dark v-if="!isNaN(messageNotificationCount)">
                <v-badge color="red" class="pt-0" :content="messageNotificationCount" bottom right overlap offset-x="8" offset-y="28">
                  <v-icon aria-hidden="false" icon="mdi-email-outline" size="40" color="white" />
                </v-badge>
              </v-btn>
              <!-- Skeleton loader layout is off so render with custom style in if/else -->
              <v-skeleton-loader type="chip" style="margin-top: -10px; background-color: #003366; width: 80px" v-else></v-skeleton-loader>
            </v-col>
            <v-col>
              <v-menu name="user_options" offset-y>
                <template #activator="{ props }">
                  <v-chip v-bind="props" tabindex="0" pill color="#003366" dark class="mt-1">
                    <v-avatar left color="info">{{ userInfo.displayName[0] }}</v-avatar>
                    <span class="display-name pl-1">{{ userInfo.displayName }}</span>
                  </v-chip>
                </template>
                <v-list dark style="background-color: #003366; color: white">
                  <v-list-item class="user-link" id="impersonate_button" v-if="isMinistryUser" :to="{ name: 'impersonate' }" title="Impersonate" />
                  <v-list-item class="user-link" id="logout_button" :href="authRoutes.LOGOUT" title="Log Out" />
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </div>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import { useNotificationsStore } from '@/stores/notifications'
import { AuthRoutes } from '@/utils/constants'

export default {
  data() {
    return {
      authRoutes: AuthRoutes,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo', 'isAuthenticated', 'isMinistryUser']),
    ...mapState(useMessagesStore, ['assistanceRequests', 'unreadMessageCount']),
    ...mapState(useNotificationsStore, ['unreadNotificationCount']),
    dataReady: function () {
      return this.userInfo
    },
    appTitle() {
      return import.meta.env.VITE_APP_TITLE || 'Operating Funding Model'
    },
    appTitleXs() {
      const index = this.appTitle.indexOf(' ')
      return `${this.appTitle.substring(0, index)}<br/>${this.appTitle.substring(index + 1)}`
    },
    xl() {
      return this.$vuetify.display.xl
    },
    xs() {
      return this.$vuetify.display.xs
    },
    messageNotificationCount() {
      return this.actionRequiredAndUnreadMessageCount + this.unreadNotificationCount
    },
    // count of requests that are unread or are in the status of “Action required”
    actionRequiredAndUnreadMessageCount() {
      const readActionRequiredMessagesCount = this.assistanceRequests?.filter((message) => message.status === 'Action required' && message.isRead)?.length
      return this.unreadMessageCount + readActionRequiredMessagesCount
    },
  },
  async created() {
    try {
      await this.getUserInfo()
      await this.getNotifications(this.userInfo.contactId)
      await this.getAssistanceRequests(this.userInfo?.contactId)
    } catch (error) {
      console.info(error)
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['getUserInfo']),
    ...mapActions(useMessagesStore, ['getAssistanceRequests']),
    ...mapActions(useNotificationsStore, ['getNotifications']),
  },
}
</script>

<style scoped>
.gov-header .v-icon {
  padding-left: 10px;
}

.sizingForIconXLScreen {
  width: 1470px;
}

a {
  text-decoration: none;
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

.verticalLine {
  border-left: 1px solid #dfb433;
  height: 50px;
  margin-left: 12px;
  padding-left: 24px;
}

.gov-header .title {
  color: #fff;
  text-decoration: none;
}

.sysBar {
  border-bottom: 2px solid rgb(252, 186, 25) !important;
  z-index: 8;
}

.gov-header .v-btn,
.v-btn--active.title:before,
.v-btn.title:focus:before,
.v-btn.title:hover:before {
  color: #fff;
  background: none;
}

/** Add active/hover styles to v-chip since Vuetify doesn't apply by default */
.v-chip .v-chip__content {
  padding-right: 12px;
}

.v-chip .v-chip__content:hover {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
}

.v-chip .v-chip__content:active {
  background: rgba(255, 255, 255, 0.5);
}

.secondary_color {
  background-color: var(--v-secondary-base);
}

.v-input__slot {
  padding-top: 10px;
}

.display-name {
  color: white;
}

.top-down {
  padding-top: 20px;
  height: 80%;
}

.mainTitle {
  color: #ffffff;
}

@media screen and (max-width: 801px) {
  .logo {
    width: 100px;
  }

  .mainTitle {
    font-size: 1rem;
  }

  .display-name {
    display: none;
  }
}
</style>
