<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app-bar absolute color="rgb(0, 51, 102)" class="sysBar pl-10 pr-10" style="z-index: 1002">
    <!-- Navbar content -->
    <a tabindex="-1" href="/">
      <img tabindex="-1" src="@/assets/images/bc-gov-logo.svg" class="logo" alt="B.C. Government Logo" />
    </a>
    <a tabindex="-1" href="/">
      <img class="verticalLine" />
    </a>
    <v-toolbar-title style="margin-left: 0px;">
      <h3>{{ appTitle }}</h3>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div v-if="isAuthenticated && user">
      <v-menu name="user_options" offset-y>
        <template #activator="{ props }">
          <v-chip v-bind="props" tabindex="0" pill color="#003366" dark>
            <v-avatar left color="info">
              {{ user.userName[0] }}
            </v-avatar>
            <span class="display-name pl-1">{{ user.userName }}</span>
          </v-chip>
        </template>
        <v-list dark style="background-color: #003366; color: white">
          <v-list-item :href="routes.LOGOUT" id="logout_button" style="min-height: 4vh" title="Logout" />
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { Routes } from '@/utils/constants'
import { useAuthStore } from '@/stores/auth'

export default {
  data() {
    return {
      appTitle: import.meta.env.VITE_APP_TITLE,
      routes: Routes,
      user: null
    }
  },
  created() {
      useAuthStore().getUserInfo().then(() => {
        this.user = this.userInfo
      })
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo', 'isAuthenticated'])
  },
  methods: {
    ...mapActions(useAuthStore, ['getUserInfo']),
    useAuthStore
  }
}
</script>

<style>
.gov-header .v-icon {
  padding-left: 10px;
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

.verticalLine {
  border-left: 1px solid #DFB433;
  height: 50px;
  margin-left: 12px;
  padding-left: 24px;
  margin-top: 4px;
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
  font-size: 1.0rem;
}
</style>
