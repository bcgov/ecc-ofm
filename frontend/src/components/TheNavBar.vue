<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <div class="mb-1">
    <v-navigation-drawer v-model="drawer" clipped app color="#E9EBEF" width="15%" temporary>
      <v-list>
        <div v-for="item in items.filter((obj) => obj.authorized)" :key="item.title">
          <v-list-item v-if="!item.items" :id="stripWhitespace(item.title + `MenuBtn`)" :key="item.title + `1`" class="menuRow">
            <router-link :to="{ name: item.link }" :target="item.newTab ? '_blank' : '_self'" class="router">
              <v-list-item>
                <v-list-item-title v-if="item.link === $route.name" class="menuItem">
                  <strong>{{ item.title }}</strong>
                </v-list-item-title>
                <v-list-item-title v-else class="menuItem">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </router-link>
          </v-list-item>
          <v-list-group v-else :id="stripWhitespace(item.title) + `MenuBtn`" :key="item.title" no-action active-class="active" class="groupMenu" append-icon="" @click="setActive(item)">
            <template #activator="{ props }">
              <v-list-item v-bind="props">
                <v-list-item-title class="menuItem ml-4" v-text="item.title" />
              </v-list-item>
            </template>

            <v-list-item v-for="subItem in item.items.filter((obj) => obj.authorized)" :id="stripWhitespace(subItem.title) + `MenuBtn`" :key="subItem.title" class="subMenuRow pl-9">
              <router-link :to="{ name: subItem.link }" :target="subItem.newTab ? '_blank' : '_self'" class="router">
                <v-list-item>
                  <v-list-item-title v-if="subItem.link === $route.name" class="menuItem">
                    <strong>{{ subItem.title }}</strong>
                  </v-list-item-title>
                  <v-list-item-title v-else class="menuItem" v-text="subItem.title" />
                </v-list-item>
              </router-link>
            </v-list-item>
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar id="navBar" absolute elevation="0" color="#38598A" style="z-index: 1001" :dark="true" class="pl-12 pr-8" density="compact">
      <v-app-bar-nav-icon id="menuBtn" style="color: white; margin-left: -40px" @click="drawer = true">
        <v-icon v-if="!drawer">$menu</v-icon>
        <v-icon v-else>$close</v-icon>
      </v-app-bar-nav-icon>
      <v-app-bar-title style="margin-left: 0px">Menu</v-app-bar-title>
      <v-toolbar-title class="ml-4 nav-title pl-4">
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <!-- <v-app-bar v-if="bannerColor !== ''" style="color: white" :color="bannerColor" sticky dense height="20rem" clipped-left>
      <div>
        <h3 class="envBanner pl-5">{{ bannerEnvironment }} Environment</h3>
      </div>
    </v-app-bar> -->
  </div>
</template>

<script>
import { PAGE_TITLES /*, REQUEST_TYPES*/ } from '@/utils/constants'
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import StaticConfig from '@/common/staticConfig.js'

export default {
  name: 'NavBar',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      drawer: null,
      bannerEnvironment: StaticConfig.BANNER_ENVIRONMENT,
      bannerColor: StaticConfig.BANNER_COLOR,
    }
  },
  async created() {
    /* TODO: Uncomment if we are loading bannerEvn and banner cole from configuration
    appStore().getConfig().then(() => {
      this.bannerEnvironment = this.config.BANNER_ENVIRONMENT;
      this.bannerColor = this.config.BANNER_COLOR;
    });
    */
  },
  computed: {
    ...mapState(useAppStore, ['config']),
    //TODO: 3 temp roles ('CCP_ROLE', 'OPS_ROLE', 'PCM_ROLE') were created in auth.js (loosely
    //based on OFM requirements) for the purpose of achieving a 1st draft of the frontend that
    //will render a home screen and menu with minimal errors given no authorization/backend integration.
    //Thus the following related code is only temporarly and expected to be replaced.
    ...mapState(useAuthStore, ['isAuthorizedUser', 'CCP_ROLE', 'OPS_ROLE', 'PCM_ROLE']),
    items() {
      return [
        {
          title: PAGE_TITLES.INTAKE,
          link: 'intake',
          authorized: this.CCP_ROLE,
        },
        {
          title: PAGE_TITLES.CONTRACT_MANAGEMENT,
          link: 'contractManagement',
          authorized: this.OPS_ROLE,
        },
        {
          title: PAGE_TITLES.PAYMENTS,
          link: 'payments',
          authorized: this.PCM_ROLE,
        },
        {
          title: PAGE_TITLES.REPORTING,
          link: 'reporting',
          authorized: this.OPS_ROLE,
        },
        {
          title: PAGE_TITLES.ACCOUNT_MAINTENANCE,
          link: 'accountMaintenance',
          authorized: this.PCM_ROLE,
        },
        {
          title: PAGE_TITLES.MAINTENANCE_REQUEST_EXCEPTION_STREAM,
          link: 'maintRequetExceptionStream',
          newTab: true,
          authorized: this.PCM_ROLE,
        },
      ]
    },
  },
  methods: {
    setActive(item) {
      let index = this.items.findIndex((obj) => obj.title === item.title)
      if (item.active) {
        this.items[index].active = false
      } else {
        this.items.filter((obj) => obj.items && obj.active).forEach((obj) => (obj.active = !obj.active))
        this.items[index].active = true
      }
    },
    stripWhitespace(title) {
      return title.replace(/\s+/g, '')
    },
  },
}
</script>
<style scoped>
#navBar {
  z-index: 7;
}

.router {
  width: 100%;
}

.menuItem {
  color: #003366;
}

.menuRow,
.groupMenu {
  border-bottom: 2px solid #d2d2d2;
}

.router:hover .v-list-item__content,
:deep(.v-list-group__header:hover .v-list-item__content),
.router-link-exact-active .router:hover .v-list-item__content,
.v-list-group__header:hover .v-list-item__content,
.router-link-exact-active {
  text-decoration: underline #003366;
}

.subMenuRow {
  border-top: 2px solid #d2d2d2;
  border-left: 4px solid #fcba19;
  background-color: white;
}

.menuRow :deep(i) {
  color: #003366;
}

.active {
  border-left: 4px solid #fcba19;
  background-color: white;
}

header :deep(.v-toolbar__content) {
  padding-left: 0 !important;
}

:deep(.v-list-group__header):before {
  background-color: #e9ebef;
}

:deep(.subMenuRow > div.v-list-item__append > i) {
  display: none;
}

:deep(.subMenuRow > div.v-list-item__content > a > div > div.v-list-item__append > i) {
  display: none;
}

.nav-title {
  font-size: 1.4rem;
  color: white;
}
</style>
