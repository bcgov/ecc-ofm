<template>
  <v-data-table-virtual
    v-if="assistanceRequests?.length > 0"
    v-model="selectedRows"
    :headers="headers"
    :items="assistanceRequests"
    item-key="assistanceRequestId"
    item-value="assistanceRequestId"
    height="65vh"
    show-select
    hover
    fixed-header
    density="compact">
    <!-- HEADERS -->
    <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
      <tr>
        <th v-for="column in columns" :key="column.key" :style="{ width: column.width }" @click="toggleSort(column)">
          <div v-if="column.title === ''">
            <v-checkbox
              v-model="headerCheckboxState"
              :indeterminate="bodyCheckboxesSelected.length > 0 && bodyCheckboxesSelected.includes(true)"
              hide-details
              density="compact"
              @click.stop="headerCheckboxClickHandler" />
          </div>
          <div v-else class="headers">
            {{ column.title }}
            <v-icon v-if="isSorted(column)" size="20" class="pa-0, ma-0">{{ getSortIcon(column) }}</v-icon>
          </div>
        </th>
      </tr>
    </template>
    <!-- BODY -->
    <template #item="{ item, index }">
      <tr :class="{ 'unread-notification': !item.categoryName, 'highlighted-row': index === rowClickedIndex }" item-key="assistanceRequestId" @click="rowClickHandler(item, index)">
        <td :class="{ 'highlighted-row': index === rowClickedIndex }">
          <v-checkbox v-model="bodyCheckboxesSelected[index]" hide-details density="compact" @click.stop="bodyCheckboxesClickHandler" />
        </td>
        <td :class="{ 'highlighted-row': index === rowClickedIndex }">
          <div class="item">{{ item.status }}</div>
        </td>
        <td :class="{ 'highlighted-row': index === rowClickedIndex }">
          <div class="item">{{ item.subject }}</div>
        </td>
        <td :class="{ 'highlighted-row': index === rowClickedIndex }">
          <div class="item">{{ item.categoryName }}</div>
        </td>
        <td :class="{ 'highlighted-row': index === rowClickedIndex }">
          <div class="item">{{ item.lastUpdatedTime }}</div>
        </td>
      </tr>
    </template>
  </v-data-table-virtual>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useMessagesStore } from '@/stores/messages'

export default {
  name: 'AssistanceRequestTable',
  props: {
    isMarkReadButtonClicked: {
      type: Boolean,
      default: false,
    },
    isMarkUnreadButtonClicked: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['openRequestConversation'],
  data() {
    return {
      headers: [
        { title: 'Status', align: 'start', key: 'status', sortable: true, width: '15%' },
        { title: 'Subject', align: 'start', key: 'subject', sortable: true, width: '40%' },
        { title: 'Topic', align: 'start', key: 'categoryName', sortable: true, width: '25%' },
        { title: 'Last updated', align: 'start', key: 'lastUpdatedTime', sortable: true, width: '20%' },
      ],
      selectedRows: [],
      headerCheckboxState: false,
      bodyCheckboxesSelected: [],
      rowClickedIndex: null,
      checkBoxToggleAllState: false, // on/off state for toggle all checkbox
      rowCheckedIndexes: [], // on/off state for checkboxes in list
      checkBoxClickedState: false, // on/off state for a checkbox clicked
      assistanceRequestSelected: null,
    }
  },
  computed: {
    ...mapState(useMessagesStore, ['assistanceRequests']),
  },
  watch: {
    isMarkReadButtonClicked: {
      handler() {
        console.log('Mark Read Button is Clicked')
      },
    },
    isMarkUnreadButtonClicked: {
      handler() {
        console.log('Mark Unread Button is Clicked')
      },
    },
  },
  created() {
    this.initAllCheckboxState()
  },
  methods: {
    ...mapActions(useMessagesStore, ['createNewAssistanceRequest']),

    /**
     * Initializes the header and body/item checkboxes to false.
     */
    initAllCheckboxState() {
      this.headerCheckboxState = false
      this.bodyCheckboxesSelected = new Array(this.assistanceRequests.length).fill(false)
    },
    /**
     * Handles the header checkbox click event. When the header checkbox is clicked all body/item checkboxes are selected.
     */
    headerCheckboxClickHandler() {
      this.bodyCheckboxesSelected.fill(!this.headerCheckboxState)
    },
    /**
     *  This must exist to avoid mutation of the array
     */
    bodyCheckboxesClickHandler() {},
    /**
     * Update the body/item checkboxes to read or unread.
     */
    updateBodyCheckboxesReadUnread(isRead) {
      this.bodyCheckboxesSelected.forEach((item, index) => {
        if (item) {
          // jstorey can remove?
          this.assistanceRequests[index].isRead = isRead
          this.updateNotification(this.assistanceRequests[index], isRead)
        }
      })
      this.initAllCheckboxState()
    },
    /**
     * Handles the row click event. When a row is clicked the assistanceRequests in context is displayed and marked as read.
     */
    rowClickHandler(item, index) {
      console.log('rowClickHandler item = ' + item.assistanceRequestId)
      this.rowClickedIndex = index // Used for row select highlighting in template slot item
      this.assistanceRequestSelected = this.assistanceRequests?.find((assistanceRequest) => assistanceRequest.assistanceRequestId === item?.assistanceRequestId)
      // this.assistanceRequestSelected.isRead = true
      // this.updateNotification(this.assistanceRequestSelected)
      this.$emit('openRequestConversation', item.assistanceRequestId)
    },
    /**
     * Updates the currnetly clicked/selected notification to unread.
     */
    updateNotificationUnread() {
      this.assistanceRequestSelected.isRead = false
      this.updateNotification(this.assistanceRequestSelected)
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

.item {
  padding-left: 30px;
}

.headers {
  padding-left: 30px;
  font-weight: bold;
  color: #878787;
}

.headers:hover {
  padding-left: 30px;
  font-weight: bold;
  color: black;
  cursor: pointer;
}

.unread-notification {
  font-size: small;
  font-weight: bold;
}

.highlighted-row {
  background-color: #d4eaff;
}
</style>
