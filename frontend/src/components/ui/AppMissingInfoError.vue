<template>
  <div class="error-message">
    <ul class="ml-8 my-4">
      <li><slot></slot></li>
    </ul>
    <div v-if="!isEmpty(to)" align="right" class="mb-4">
      <router-link class="error-message" :to="to">To add this information, click here. This will bring you to a different page.</router-link>
    </div>
  </div>
</template>
<script>
import { isEmpty } from 'lodash'

export default {
  inheritAttrs: true,
  props: {
    to: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  methods: {
    isEmpty,
  },
}
</script>
