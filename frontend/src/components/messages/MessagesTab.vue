<template>
  <v-container class="pa-3">
    <v-row>
      <v-col cols="6" class="border-right pa-0">
        <v-data-table-virtual :headers="headers" show-select hover fixed-header density="compact" class="data-table">
          <template #top>
            <v-row>
              <v-col class="mt-1">
                <div class="flex-item">
                  <v-btn class="btn-style" @click="toggleNewRequestDialog()">
                    <v-icon class="icon" left>mdi-email-plus-outline</v-icon>
                    <span class="btn-label">New message</span>
                  </v-btn>
                  <v-btn class="btn-style" @click="false">
                    <v-icon class="icon" left>mdi-email-outline</v-icon>
                    <span class="btn-label">Mark unread</span>
                  </v-btn>
                  <v-btn class="btn-style" @click="false">
                    <v-icon class="icon" left>mdi-email-open-outline</v-icon>
                    <span class="btn-label">Mark read</span>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </template>
          <!-- <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
              <th v-for="column  in  columns" :key="column.key" @click="toggleSort(column)"
                :style="{ width: column.width }">
                <div v-if="column.title === null">
                  <v-checkbox v-model="checkBoxToggleAllState" @click="toggleAllCheckBoxHandler" hide-details
                    density="compact"></v-checkbox>
                </div>
                <div v-else>
                  {{ column.title }}
                  <v-icon v-if="isSorted(column)">{{ getSortIcon(column) }}</v-icon>
                </div>
              </th>
            </tr>
          </template>
          <template #item="{ item, index }">
            <tr @click="rowClickHandler(item, index)"
              :class="{ 'unread-notification': !item.selectable.isRead, 'highlighted': index === rowClickedIndex }">
              <td :class="{ 'highlighted': index === rowClickedIndex }">
                <v-checkbox @click="checkBoxClickHandler" v-model="checkBoxListState[index]" hide-details
                  density="compact"></v-checkbox>
              </td>
              <td :class="{ 'highlighted': index === rowClickedIndex }">{{ (item.selectable.isRead) ? 'Read' : 'Unread' }}
              </td>
              <td :class="{ 'highlighted': index === rowClickedIndex }">{{ item.selectable.subject }}</td>
              <td :class="{ 'highlighted': index === rowClickedIndex }">{{ item.selectable.dateReceived }}</td>
            </tr>
          </template> -->
        </v-data-table-virtual>
      </v-col>
      <v-col cols="6">
        <v-card v-if="false" variant="flat">
          <v-card-title class="card-title d-flex align-start flex-wrap">
            <!-- <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center">
                <span class="font-bold">From:</span>&nbsp;Operating Funding Model Program
              </div>
                <v-icon class="icon ml-3">mdi-email-outline</v-icon>
                <span class="icon-text">Mark Unread</span>
              </div>
            </div> -->
            <!-- <div class="mt-2 w-100">
              {{ notificationSelected.selectable.subject }}
            </div> -->
          </v-card-title>
          <hr />
          <v-card-text></v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <NewRequestDialog class="pa-0" :show="showNewRequestDialog" @close="toggleNewRequestDialog" />
  </v-container>
</template>

<script>
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'

export default {
  name: 'MessagesTab',
  components: { NewRequestDialog },
  data() {
    return {
      showNewRequestDialog: false,
      headers: [
        { title: null, align: 'start', key: 'name', sortable: false, width: '8%' },
        { title: 'Status', align: 'start', key: 'isRead', sortable: true, width: '10%' },
        { title: 'Subject', align: 'start', key: 'subject', sortable: true, width: '30%' },
        { title: 'Topic', align: 'start', key: 'topic', sortable: true, width: '20%' },
        { title: 'Last updated', align: 'start', key: 'dateReceived', sortable: true, width: '30%' },
      ],
    }
  },
  computed: {},
  methods: {
    toggleNewRequestDialog() {
      this.showNewRequestDialog = !this.showNewRequestDialog
    },
  },
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
  height: 524px;
}

.flex-item {
  display: flex;
  align-items: left;
}

.btn-style {
  padding: 0px 6px !important;
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

.btn-style:hover {
  background-color: #ffffff;
}

.btn-style:hover .btn-label {
  text-decoration: underline;
}

.item {
  padding-left: 4px;
}

.btn-style .v-btn__content .icon {
  padding: 0px !important;
  margin: 0px;
  font-size: 1.5em;
}

.headers {
  padding-left: 4px !important;
  font-weight: bold !important;
  color: #878787 !important;
}

.headers:hover {
  padding-left: 4px !important;
  font-weight: bold !important;
  color: black !important;
  cursor: pointer !important;
}

.font-bold {
  font-weight: bold;
}

.unread-notification {
  font-size: small;
  font-weight: bold;
}

.border-right {
  border-right: 2px solid #6699cc;
}

.highlighted-row {
  background-color: #d4eaff !important;
}
</style>
