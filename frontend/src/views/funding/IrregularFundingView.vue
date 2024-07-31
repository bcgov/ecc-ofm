<template>
  <OrganizationHeader :show-facility="false" />
  <v-container fluid v-bind="$attrs" class="px-md-16">
    <p>Carefully review your funding</p>

    <h4 class="my-10">Approval Notification For Irregular Expense</h4>

    <AppPDFViewer :pdf-file="pdfFile" />

    <AppBackButton id="back-button" width="240px" :to="{ name: 'funding-overview' }">Funding</AppBackButton>

    <v-row v-if="!loading" class="justify-end mx-5 my-3">
      <a style="text-decoration: none" :download="downloadFileName" :href="pdfDownloadLink">
        <AppButton size="medium" width="240px" class="mt-2 justify-end" :loading="loading">Download PDF</AppButton>
      </a>
    </v-row>
  </v-container>
</template>

<script>
import alertMixin from '@/mixins/alertMixin'
import AppButton from '@/components/ui/AppButton.vue'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import IrregularExpenseService from '@/services/irregularExpenseService'
import AppPDFViewer from '@/components/ui/AppPDFViewer.vue'

export default {
  name: 'ApprovedFundingView',
  components: { AppBackButton, AppButton, OrganizationHeader, AppPDFViewer },
  mixins: [alertMixin],
  data() {
    return {
      pdfFile: undefined,
      pdfDownloadLink: undefined,
      application: undefined,
      loading: false,
    }
  },
  computed: {
    downloadFileName() {
      return `Approval_Notification_${this.application?.referenceNumber}`
    },
  },

  async created() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      try {
        this.loading = true
        this.application = await IrregularExpenseService.getIrregularExpenseById(this.$route.params.fundingGuid)
        const resp = await IrregularExpenseService.getIrregularExpensePDF(this.$route.params.fundingGuid)
        this.pdfFile = {
          data: atob(resp),
        }
        this.pdfDownloadLink = `data:application/pdf;base64,${resp}`
      } catch (error) {
        this.setWarningAlert('PDF Generation is still in progress. Please wait a few minutes before you try again.')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
