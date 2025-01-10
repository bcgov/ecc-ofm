<template>
  <v-container fluid>
    <AppSimpleCard>
      <template #title>Unauthorized Access</template>
      <template #text>You do not have required role to perform the requested action.</template>
    </AppSimpleCard>
  </v-container>
</template>

<script>
import AppSimpleCard from '@/components/ui/AppSimpleCard.vue'

export default {
  name: 'UnauthorizedView',
  components: { AppSimpleCard }
}
</script>
