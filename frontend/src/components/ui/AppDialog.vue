<template>
  <v-dialog>
    <template #default="{ isActive }">
      <v-card>
        <div class="pb-3" style="background-color: #003366">
          <v-card-title class="text-white px-10">
            <v-row no-gutters justify="space-between" align="center">
              <h3>{{ title }}</h3>
              <v-btn variant="text" icon="mdi-window-close" @click="closeDialog()" />
            </v-row>
          </v-card-title>
        </div>
        <div style="background-color: #ffc72c; padding: 2px"></div>
        <v-card-text class="mb-4">
          <slot name="content"></slot>
        </v-card-text>
        <v-card-actions class="mb-4">
          <slot name="button"></slot>
        </v-card-actions>
      </v-card>
    </template>
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
  emits: ['closeDialog'],
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>
