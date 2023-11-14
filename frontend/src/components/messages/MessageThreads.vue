<template>
  <v-container class="pa-3">
    <v-row v-if="assistanceRequest">
      <v-col cols="12" class="border-right pa-0">
        <v-data-table-virtual :headers="headers" :items="assistanceRequestMessages" item-key="messageId"
          class="data-table">
          <template #top>
            <v-row>
              <v-col cols="5">
                <span class="subject-header">Subject: {{ assistanceRequest.subject }}</span>
              </v-col>
              <v-col cols="7" class="d-flex flex-column align-end pb-0">
                <v-btn class="btn-style">
                  <v-icon class="icon" left>mdi-email-open-outline</v-icon>
                  <span class="btn-label">Mark unread</span>
                </v-btn>
                <v-btn class="btn-style mr-15">
                  <v-icon class="icon" left>mdi-reply</v-icon>
                  <span class="btn-label">Reply</span>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2" class="font-weight-bold pt-0">Status:</v-col>
              <v-col cols="3" class="pl-4 pt-0">{{ assistanceRequest.status }}</v-col>
              <v-col cols="2" class="font-weight-bold pt-0">Reference#:</v-col>
              <v-col cols="5" class="pt-0">{{ assistanceRequest.referenceNumber }}</v-col>
            </v-row>
            <v-row>
              <v-col cols="2" class="font-weight-bold pt-0 pb-0">Topic:</v-col>
              <v-col cols="3" class="pl-4 pt-0 pb-0">{{ assistanceRequest.categoryName }}</v-col>
              <v-col cols="2" class="font-weight-bold pt-0 pb-0">Facility(s):</v-col>
              <v-col cols="5" class="pt-0 pb-0">?requestFacilities[]?</v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-end pt-0 mr-0 pr-2 w-100 align-center"><span class="font-weight-bold">Sort
                  By:</span>
                <v-btn class="btn-style" @click="toggleSort()">
                  <span class="btn-label">{{ isSortedDesc ? 'Newest' : 'Oldest' }} first</span>
                  <v-icon v-if="isSortedDesc" class="icon">mdi-arrow-up</v-icon>
                  <v-icon v-else class="icon">mdi-arrow-down</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <hr>
          </template>
          <template #headers>
          </template>
          <template #item="{ item }">
            <v-row style="border-bottom: 1px solid #E0E0E0;" class="mr-0">
              <v-col>
                <div><span class="font-weight-bold">From:</span> {{ item.from }}</div>
                <div><span class="font-weight-bold">Sent:</span> {{ item.sentDate }}</div>
                <div class="pt-1">{{ item.message }}</div>
              </v-col>
            </v-row>
          </template>
        </v-data-table-virtual>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>
import { mapState, mapActions } from 'pinia'
import { useMessagesStore } from '@/stores/messages'

export default {
  props: {
    assistanceRequestId: {
      type: [String, null],
      required: true,
      default: ''
    }
  },
  data() {
    return {
      isSortedDesc: true,
      assistanceRequest: null,
      headers: [
        {
          title: 'dateReceived',
          key: 'dateReceived',
          sortable: true
        }
      ],
    }
  },
  computed: {
    ...mapState(useMessagesStore, ['assistanceRequests', 'assistanceRequestMessages', 'getAssistanceRequestMessages']),
  },
  watch: {
    assistanceRequestId(newVal) {
      this.assistanceRequest = this.assistanceRequests.find(item => item.assistanceRequestId = newVal)
      this.getAssistanceRequestMessages(this.assistanceRequestId)
    },
  },
  methods: {
    ...mapActions(useMessagesStore, ['createNewAssistanceRequest']),
    toggleSort() {
      this.isSortedDesc = !this.isSortedDesc
      this.assistanceRequestMessages.sort((a, b) => (a.dateReceived > b.dateReceived) ? 1 : -1)
    }
  }
}
</script>
  
<style scoped>
th {
  padding: 0px 0px 0px 4px !important;
}

td {
  padding: 0px 3px 0px 4px !important;
}

hr {
  border: 0;
  height: 1px;
  background: #6699cc;
  background-image: linear-gradient(to right, #6699cc, #6699cc, #6699cc);
}

.data-table {
  height: 635px;
}

.subject-header {
  font-size: 20px;
  font-weight: bold;
  color: #003466;
}

.btn-style .v-btn__content .icon {
  padding: 0px;
  margin: 0px;
  font-size: 1.5em;
}

.btn-style {
  padding: 0px 6px;
  margin: 0px;
  font-size: 14px;
  background-color: #ffffff;
  color: #6699cc;
  font-weight: bold;
  text-transform: none;
  max-height: 28px;
  border: none;
  box-shadow: none;
}

.reply-btn {
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.btn-style:hover {
  background-color: #ffffff;
}

.btn-style:hover .btn-label {
  text-decoration: underline;
}
</style>
  