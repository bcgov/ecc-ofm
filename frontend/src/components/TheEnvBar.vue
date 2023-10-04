<template>
  <v-app-bar class="env-bar" v-if="bannerColor !== ''" :color="bannerColor" density="compact" height="50rem"
    ><div>
      <h3 class="envBanner">{{ bannerEnvironment }} Environment</h3>
    </div></v-app-bar
  >

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
  color: #ffffff;
  height: 20px;
  margin-top: 2px;
  padding: 0px 16px;
}
</style>
