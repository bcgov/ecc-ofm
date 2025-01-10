<template>
  <v-container fluid>
    <AppSimpleCard>
      <template #title>System Error</template>
      <template #text>
        You have encountered a System Error.
        <br />
        Close your Web browser, open a new session, then try again.
      </template>
    </AppSimpleCard>
  </v-container>
</template>

<script>
import AppSimpleCard from '@/components/ui/AppSimpleCard.vue'

export default {
  name: 'ErrorView',
  components: { AppSimpleCard }
}
</script>
