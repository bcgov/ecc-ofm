<template>
  <v-container class="pa-3">
    <v-row>
      <v-col cols="6" class="border-right pa-0">
        <v-data-table :headers="headers" hover single-select height="500px" density="compact">
          <template v-slot:top>
            <div class="slot-top">
              <div class="flex-container">
                <div id="new-message" @click="toggleNewRequestDialog()" class="flex-item message-button">
                  <v-icon class="icon">mdi-email-plus-outline</v-icon>
                  <span class="icon-text">New message</span>
                </div>
                <div @click="false" class="flex-item message-button">
                  <v-icon class="icon">mdi-email-outline</v-icon>
                  <span class="icon-text">Mark unread</span>
                </div>
                <div @click="false" class="flex-item message-button">
                  <v-icon class="icon">mdi-email-open-outline</v-icon>
                  <span class="icon-text">Mark read</span>
                </div>
              </div>
            </div>
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
          <template v-slot:bottom></template>
        </v-data-table>
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
.flex-container {
  display: flex;
  justify-content: space-evenly;
}

.flex-item {
  display: flex;
  align-items: left;
}

.icon {
  font-size: 24px;
  padding-right: 2px;
  color: #6699cc;
  cursor: pointer;
}

.icon-text {
  color: #6699cc;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 2px 0px;
}

.message-button:hover {
  opacity: 0.8;
}

.font-bold {
  font-weight: bold;
}

.slot-top {
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.unread-notification {
  font-size: small;
  font-weight: bold;
}

.border-right {
  border-right: 2px solid #6699cc;
}

hr {
  border: 0;
  height: 1px;
  background: #6699cc;
  background-image: linear-gradient(to right, #6699cc, #6699cc, #6699cc);
}

.card-title {
  font-size: medium;
  padding-left: 0px !important;
}

.highlighted {
  background-color: #d4eaff !important;
}
</style>
