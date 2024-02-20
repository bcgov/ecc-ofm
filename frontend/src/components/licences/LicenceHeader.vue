<template>
  <h4 class="my-2">Licence {{ licence.licence }}</h4>
</template>

<script>
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
}
</script>
