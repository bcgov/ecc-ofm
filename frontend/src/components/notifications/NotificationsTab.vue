<template>
    <v-row>
        <v-col cols="6" class="border-right pa-0">
            <v-data-table :headers="headers" :items="notifications" item-key="messageId" hover single-select height="500px"
                density="compact">
                <template v-slot:top>
                    <div class="slot-top">
                        <div class="flex-container">
                            <!--div class="flex-item">
                                <v-icon class="icon">mdi-email-plus-outline</v-icon><span class="icon-text">New
                                    Message</span>
                            </div-->
                            <div class="flex-item">
                                <v-icon @click="updateCheckedReadUnread(false)" class="icon">mdi-email-outline</v-icon><span
                                    class="icon-text">Mark
                                    Unread</span>
                            </div>
                            <div class="flex-item">
                                <v-icon @click="updateCheckedReadUnread(true)"
                                    class="icon">mdi-email-open-outline</v-icon><span class="icon-text">Mark
                                    Read</span>
                            </div>
                        </div>
                    </div>
                </template>
                <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
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
                        :class="{ 'unread-message': item.selectable.isRead === false, 'highlighted': index === rowClickedIndex }">
                        <td :class="{ 'highlighted': index === rowClickedIndex }">
                            <v-checkbox @click="checkBoxClickHandler" v-model="checkBoxListState[index]" hide-details
                                density="compact"></v-checkbox>
                        </td>
                        <td :class="{ 'highlighted': index === rowClickedIndex }">{{ item.selectable.isRead }}</td>
                        <td :class="{ 'highlighted': index === rowClickedIndex }">{{ item.selectable.subject }}</td>
                        <td :class="{ 'highlighted': index === rowClickedIndex }">{{ item.selectable.dateReceived }}</td>
                    </tr>
                </template>
                <template v-slot:bottom></template>
            </v-data-table>
        </v-col>
        <v-col cols="6">
            <v-card v-if="message" variant="flat">
                <v-card-title class="card-title d-flex align-start flex-wrap">
                    <div class="d-flex align-center justify-space-between w-100">
                        <div class="d-flex align-center">
                            <span><b>From:</b></span>&nbsp;Operating Funding Model Program
                        </div>
                        <div v-if="isRead(message)" class="d-flex align-center">
                            <span @click="updateMessageUnread(message)" class="icon-text">Mark Unread</span>
                            <v-icon @click="updateMessageUnread(message)" class="icon ml-3">mdi-email-outline</v-icon>
                        </div>
                    </div>
                    <div class="mt-2 w-100">
                        {{ message.selectable.subject }}
                    </div>
                </v-card-title>
                <hr>
                <v-card-text v-html="message.selectable.messageContent"></v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>
  
<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'

export default {
    data() {
        return {
            notifications: [],
            checkBoxToggleAllState: false, // on/off state for toggle all checkbox
            checkBoxListState: [], // on/off state for checkboxes in list
            rowClickedIndex: null,
            checkBoxClickedState: false, // on/off state for a checkbox clicked
            message: null,
            headers: [
                { title: null, align: 'start', key: 'name', sortable: false, width: '8%' },
                { title: 'Read/Unread', align: 'start', key: 'isRead', sortable: true, width: '20%' },
                { title: 'Subject', align: 'start', key: 'subject', sortable: false, width: '50%' },
                { title: 'Date Received', align: 'start', key: 'dateReceived', sortable: true, width: '22%' },
            ],
        }
    },
    computed: {
        ...mapState(useAuthStore, ['userInfo']),
        ...mapState(useMessagesStore, ['messages', 'unreadMessageCount']),
    },
    created() {
        this.getNotifications()
    },
    methods: {
        ...mapActions(useMessagesStore, ['getMessages', 'updateMessage']),
        /**
         * Initializes the toggle all checkbox and checkbox list state.
         */
        initCheckBoxState() {
            this.checkBoxListState = Array(this.notifications.length).fill(false)
            this.checkBoxToggleAllState = false
        },
        /**
         * Indicates if the item is read or not.
         */
        isRead(item) {
            return item.selectable.isRead === true
        },
        /**
         * Toggles all the messages checked or unchecked.
         */
        toggleAllCheckBoxHandler() {
            this.checkBoxListState.fill(!this.checkBoxToggleAllState)
        },
        /**
         * Flags a list item has been checked.
         */
        checkBoxClickHandler() {
            this.checkBoxClickedState = true
        },
        /**
         * Handles the row click event. When a row is clicked the message is displayed and marked as read.
         */
        rowClickHandler(item, index) {
            if (!this.checkBoxClickedState) {
                this.message = item
                this.rowClickedIndex = index
                this.updateMessage(item.selectable.messageId, true)
            } else {
                this.checkBoxClickedState = false
            }
        },
        /**
         * Updates all checked messages to read or unread.
         */
        updateCheckedReadUnread(isRead) {
            this.checkBoxListState.forEach((item, index) => {
                if (item) {
                    this.updateMessage(this.notifications[index].messageId, isRead)
                }
            })
            this.initCheckBoxState()
        },
        /**
         * Updates a message to unread.
         */
        updateMessageUnread(item) {
            if (this.isRead(item)) {
                this.updateMessage(item.selectable.messageId, false)
            }
        },
        async getNotifications() {
            try {
                if (this.notifications.length === 0) {
                    await this.getMessages(this.userInfo.userId)
                    this.notifications = this.messages
                    this.initCheckBoxState()
                }
            } catch (error) {
                console.info(error)
            }
        },
    }
};
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
}

.icon-text {
    color: #6699cc;
}

.slot-top {
    padding-top: 8px;
    padding-bottom: 8px;
    border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity))
}

.unread-message {
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
    background-color: #D4EAFF !important;
}
</style>
  