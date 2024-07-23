<template>
  <OrganizationHeader :show-facility="false" />
  <v-container fluid v-bind="$attrs" class="px-md-16">
    <p>Carefully review your funding</p>

    <h4 class="my-10">Approval Notification For {{ application?.supplementaryTypeDescription }} Allowance</h4>

    <section class="my-5 py-10 grey-div-with-border">
      <v-card class="mt-5 py-10 pdf-reader">
        <VuePdfEmbed :source="pdfFile" />
      </v-card>
    </section>

    <a style="text-decoration: none" :download="'Approval_Notification_' + application?.supplementaryReferenceNumber" :href="pdfDownloadLink">
      <AppBackButton id="back-button" width="240px" :to="{ name: 'funding-overview' }">Funding</AppBackButton>
    </a>

    <v-row v-if="!loading" class="justify-end mx-5 my-3">
      <AppButton size="medium" width="240px" class="mt-2 justify-end" :loading="loading">Download PDF</AppButton>
    </v-row>
  </v-container>
</template>

<script>
import alertMixin from '@/mixins/alertMixin'
import AppButton from '@/components/ui/AppButton.vue'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import VuePdfEmbed from 'vue-pdf-embed'
import ApplicationService from '@/services/applicationService'

// essential styles
import 'vue-pdf-embed/dist/style/index.css'

export default {
  name: 'ApprovedFundingView',
  components: { AppBackButton, AppButton, OrganizationHeader, VuePdfEmbed },
  mixins: [alertMixin],
  data() {
    return {
      pdfFile: undefined,
      pdfDownloadLink: undefined,
      application: undefined,
      loading: false,
    }
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
      } catch (error) {
        this.setWarningAlert('PDF Generation is still in progress. Please wait a few minutes before you try again.')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style>
.grey-div-with-border {
  background-color: #eeeeee;
  border: 1px solid #333333;
  border-radius: 4px;
}
.pdf-reader {
  margin: auto;
  border: solid 1px black;
  max-height: 80vh;
  max-width: 830px;
  overflow-y: scroll;
}
</style>
