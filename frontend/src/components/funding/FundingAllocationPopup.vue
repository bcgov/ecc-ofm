<template>
  <v-container>
    <AppDialog v-model="isDisplayed" title="Funding Re-allocation Request Details" persistent max-width="60%" @close="closeDialog">
      <template #content>
        <v-data-table :headers="fundingRequestsHeaders" :items="allocations" item-key="fundingAllocationId" density="compact" class="soft-outline" :hide-default-footer="true">
          <template #[`item.amount`]="{ item }">$ {{ format.formatDecimalNumber(item?.amount) }}</template>
        </v-data-table>
      </template>
      <template #button>
        <v-row justify="space-around">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="dialog-go-back" :primary="false" size="large" width="300px" @click="closeDialog">Back to Summary</AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import format from '@/utils/format'

export default {
  name: 'FundingAllocationPopup',
  components: { AppButton, AppDialog },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    allocations: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['close'],
  data() {
    return {
      isDisplayed: false,
      fundingRequestsHeaders: [
        { title: 'From', key: 'envelopeNameFrom' },
        { title: 'To', key: 'envelopeNameTo' },
        { title: 'Amount', key: 'amount', align: 'end' },
      ],
    }
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      },
    },
  },
  created() {
    this.format = format
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
  },
}
</script>
