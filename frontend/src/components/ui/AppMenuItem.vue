<template>
  <v-list-item class="link" base-color="#003366" color="white" link active-class="menu-item-active">
    <v-chip style="font-size: 1em" variant="text">
      <v-icon style="margin-right: 15px" :icon="icon" />
      <slot />
    </v-chip>
  </v-list-item>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    icon: {
      type: String,
      required: false,
    },
  },
}
</script>

<style scoped>
.menu-item-active {
  background-color: #003366;
}
</style>
