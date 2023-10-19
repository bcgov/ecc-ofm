<template>
  <v-app-bar absolute color="rgb(0, 51, 102)" class="pl-10 pr-10 sysBar" style="z-index: 1002">
    <!-- Navbar content -->
    <v-container class="ma-0" :class="{ sizingForIconXLScreen: xl }" style="width: 100%" fluid="true">
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
        <!-- <div v-if="isAuthenticated && userInfo" class="mt-5">
          <v-btn @click="goToMessagePage()" id="mail_box_button" rounded class="mr-5 elevation-0" dark>
            <v-badge color="red" class="pt-0" :content="unreadMessageCount" bottom right overlap offset-x="8" offset-y="28">
              <v-icon aria-hidden="false" icon="mdi-email-outline" size="40" color="white" />
            </v-badge>
          </v-btn>
          <v-menu name="user_options" offset-y>
            <template #activator="{ props }">
              <v-chip v-bind="props" tabindex="0" pill color="#003366" dark class="mt-1">
                <v-avatar left color="info"></v-avatar>
                <span class="display-name pl-1"></span>
              </v-chip>
            </template>
            <v-list dark style="background-color: #003366; color: white">
              <v-list-item :to="{ name: 'home' }" id="logout_button" style="min-height: 4vh" title="Home" />
              <v-list-item :href="routes.LOGOUT" id="logout_button" style="min-height: 4vh" title="Logout" />
            </v-list>
          </v-menu>
        </div> -->
        <div class="logout" v-if="isAuthenticated">
          <v-btn :href="routes.LOGOUT" variant="plain" class="logout-link">Log out</v-btn>
        </div>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapState } from 'pinia'
import { Routes } from '@/utils/constants'
import { useAuthStore } from '@/stores/auth'

export default {
  data() {
    return {
      routes: Routes,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo', 'isAuthenticated']),
    unreadMessageCount() {
      return Math.floor(Math.random() * 10)
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
  },
}
</script>

<style>
.gov-header .v-icon {
  padding-left: 10px;
}

.sizingForIconXLScreen {
  width: 1470px;
}

a {
  text-decoration: none;
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
