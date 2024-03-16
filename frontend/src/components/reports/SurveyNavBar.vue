<template>
  <v-container fluid class="sticky-top">
    <div v-for="section in sections" :key="section.id">
      <v-row no-gutters class="mb-6" @click="updateCurrentSection(section)">
        <v-col cols="2" :class="getNavIconClass(section)">
          <v-icon>{{ getNavIcon() }}</v-icon>
        </v-col>
        <v-col cols="10" :class="getNavTextClass(section)">
          {{ section.title }}
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'SurveyNavBar',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    sections: {
      type: Array,
      default: () => [],
    },
    currentSection: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  emits: ['update'],
  methods: {
    getNavIconClass(section) {
      return section?.sectionId === this.currentSection?.sectionId ? 'current-icon' : 'active'
    },

    getNavTextClass(section) {
      return section?.sectionId === this.currentSection?.sectionId ? 'current-text' : 'active'
    },

    getNavIcon() {
      return 'mdi-circle'
    },

    updateCurrentSection(section) {
      this.$emit('update', section)
    },
  },
}
</script>
<style scoped>
.active {
  color: #003366;
  text-decoration: none;
}

.active:hover {
  cursor: pointer;
  text-decoration: underline;
}

.current-icon {
  color: #fcba19;
}

.current-text {
  color: #003366;
  font-weight: 700;
  text-decoration: underline;
}

.sticky-top {
  position: sticky;
  top: 100px;
  z-index: 2;
}
</style>
