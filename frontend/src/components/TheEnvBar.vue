<template>
  <v-app-bar class="env-bar" v-if="bannerColor" :color="bannerColor" height="20">
    <div>
      <h3 class="env-text">{{ bannerEnvironment }} Environment</h3>
    </div>
  </v-app-bar>
  <div>
    <h3 class="subBanner" v-if="subtitleBanner != ''">{{ subtitleBanner }}</h3>
  </div>
</template>

<script>
import { useAppStore } from '@/stores/app'
import { mapState } from 'pinia'
import StaticConfig from '@/common/staticConfig'

export default {
  name: 'TheEnvBar',
  data() {
    return {
      bannerEnvironment: StaticConfig.BANNER_ENVIRONMENT,
      bannerColor: StaticConfig.BANNER_COLOR,
    }
  },
  computed: {
    ...mapState(useAppStore, ['subtitleBanner']),
  },
}
</script>
<style scoped>
.env-bar {
  margin-top: 2px;
  padding: 0 16px;
}
.env-text {
  color: #ffffff;
  font-size: 0.8rem;
}
</style>
