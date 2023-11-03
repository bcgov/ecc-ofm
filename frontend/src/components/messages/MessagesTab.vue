<template>
  <v-container class="px-10">
    <v-btn id="new-message" text @click="openNewRequestDialog()">
        <v-icon class="mr-2">mdi-email-plus-outline</v-icon>
        New message
    </v-btn>
    <NewRequestDialog 
      :showNewRequestDialog="showNewRequestDialog"
      @closeNewRequestDialog="closeNewRequestDialog"/>
  </v-container>
</template>

<script>
import { mapState } from 'pinia';
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue';
import { useAuthStore } from '@/stores/auth';


export default {
  name: 'MessagesTab',
  components: { NewRequestDialog },
  data() {
    return {
      showNewRequestDialog: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
  methods: {
    openNewRequestDialog() {
      this.showNewRequestDialog = true;
    },
    closeNewRequestDialog() {
      this.showNewRequestDialog = false;
    },
  },
}
</script>

<style scoped>
</style>
