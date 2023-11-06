<template>
  <v-dialog>
    <v-card>
      <v-card-title class="dialog-title">
        <v-row no-gutters justify="space-between" align="center">
          <h3>{{ title }}</h3>
          <v-btn variant="text" icon="mdi-window-close" @click="$emit('close')" />
        </v-row>
      </v-card-title>
      <div class="yellow-line"></div>
      <v-card-text>
        <slot name="content"></slot>
      </v-card-text>
      <v-card-actions class="mb-4">
        <slot name="button"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  inheritAttrs: true,
  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>
<style scoped>
.dialog-title {
  background-color: #003366;
  color: white;
  padding: 10px 30px;
}
.yellow-line {
  background-color: #ffc72c;
  padding: 2px;
}
</style>
