<template>
  <v-list-item class="menu-item" base-color="#003366" color="white" link active-class="menu-item-active">
    <v-icon class="menu-icon" :icon="icon" v-if="icon" size="30" />
    <slot />
  </v-list-item>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      required: false,
    },
  },
}
</script>

<style scoped>
.menu-item {
  cursor: pointer;
  font-size: 1em;
  height: 3em;
}
.menu-item-active {
  background-color: #003366;
}

.menu-icon {
  margin-right: 15px;
}
</style>
