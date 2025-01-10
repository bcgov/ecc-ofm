<template>
  <OrganizationHeader :show-facility="false" />
  <router-view v-bind="$attrs" />
</template>

<script>
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'

export default {
  components: { OrganizationHeader }
}
</script>
