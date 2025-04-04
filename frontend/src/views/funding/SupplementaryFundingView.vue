<template>
  <OrganizationHeader :show-facility="false" />
  <v-container fluid v-bind="$attrs" class="px-md-16">
    <p>Carefully review your funding</p>

    <h4 class="my-10">Approval Notification For {{ application?.supplementaryTypeDescription }} Allowance</h4>

    <AppPDFViewer :pdf-file="pdfFile" />

    <AppBackButton id="back-button" width="240px" :to="{ name: 'funding-overview' }">Funding</AppBackButton>

    <v-row v-if="!loading && pdfFile" class="justify-end mx-5 my-3">
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
import ApplicationService from '@/services/applicationService'
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
      return `Approval_Notification_${this.application?.fundingAgreementNumber}`
    },
  },

  async created() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      try {
        this.loading = true
        this.application = await ApplicationService.getSupplementaryApplicationById(this.$route.params.fundingGuid)
        const resp = await ApplicationService.getApprovedSupplementaryPDF(this.$route.params.fundingGuid)
        this.pdfFile = {
          data: atob(resp),
        }
        this.pdfDownloadLink = `data:application/pdf;base64,${resp}`
      } catch (ignoreError) {
        this.setWarningAlert('PDF Generation is still in progress. Please wait a few minutes before you try again.')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
