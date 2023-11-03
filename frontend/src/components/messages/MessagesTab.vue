<template>
  <v-container class="px-10">
    <v-btn id="new-message" text @click="openNewRequestDialog()">
        <v-icon class="mr-2">mdi-email-plus-outline</v-icon>
        New message
    </v-btn>
    <NewRequestDialog 
      :showNewRequestDialog="showNewRequestDialog"
      @closeNewRequestDialog="closeNewRequestDialog"
      @openNewRequestConfirmationDialog="openNewRequestConfirmationDialog"/>
    <NewRequestConfirmationDialog
      :showNewRequestConfirmationDialog="showNewRequestConfirmationDialog"
      @closeNewRequestConfirmationDialog="closeNewRequestConfirmationDialog"/>
  </v-container>
</template>

<script>
import { mapState } from 'pinia';
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue';
import NewRequestConfirmationDialog from '@/components/messages/NewRequestConfirmationDialog.vue';
import { useAuthStore } from '@/stores/auth';


export default {
  name: 'MessagesTab',
  components: { NewRequestDialog, NewRequestConfirmationDialog },
  data() {
    return {
      showNewRequestDialog: false,
      showNewRequestConfirmationDialog: false,
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
    openNewRequestConfirmationDialog() {
      this.showNewRequestConfirmationDialog = true;
    },
    closeNewRequestConfirmationDialog() {
      this.showNewRequestConfirmationDialog = false;
    },
  },
}
</script>

<style scoped>
</style>
