<template>
  <v-container fluid class="px-0">
    <v-row no-gutters>
      <v-col cols="12">
        <h4 class="mb-2">Licence {{ licence.licence }}</h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  props: {
    licence: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    ...mapState(useAppStore, ['getHealthAuthorityNameById']),
  },
}
</script>
