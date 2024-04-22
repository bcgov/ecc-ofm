<template>
  <v-container fluid class="pa-0">
    <v-item-group selected-class="bg-primary">
      <v-row no-gutters>
        <v-col cols="2" lg="1" class="mt-2">
          <AppLabel>Date:</AppLabel>
        </v-col>
        <v-col cols="10" lg="11">
          <v-row no-gutters>
            <v-col v-for="date in dateFilter" :key="date" cols="6" lg="3">
              <v-item v-slot="{ isSelected, selectedClass, toggle }">
                <div :class="['d-flex', selectedClass]" @click="toggle">
                  <v-btn elevation="0" rounded="0" variant="outlined" class="flex-grow-1 text-center">
                    {{ date }}
                  </v-btn>
                </div>
              </v-item>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-item-group>
  </v-container>
</template>
<script>
import AppLabel from '@/components/ui/AppLabel.vue'

export default {
  components: { AppLabel },

  inheritAttrs: true,

  props: {
    dateFilter: {
      type: Array,
      default: () => ['3 Months', '6 Months', 'YTD', 'Custom'],
    },
  },
  data() {
    return {}
  },
  computed: {},
}
</script>
<style scoped></style>
