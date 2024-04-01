<template>
  <v-row class="my-9 ml-1">
    <v-icon size="x-large" color="warning">mdi mdi-alert</v-icon>
    <h4 class="ml-3">
      <slot name="content"></slot>
    </h4>
  </v-row>
</template>
<script>
export default {
  inheritAttrs: true,
  props: {
    message: {
      type: String,
      default: '',
    },
  },
}
</script>
