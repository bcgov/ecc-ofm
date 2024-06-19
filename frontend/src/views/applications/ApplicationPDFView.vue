<template>
  <OrganizationHeader :show-facility="false" />
  <v-container fluid v-bind="$attrs" class="px-md-16">
    <h4 class="my-10">Carefully review your completed application</h4>

    <section class="my-5 py-10 grey-div-with-border">
      <v-card class="mt-5 py-10 pdf-reader">
        <VuePdfEmbed :source="pdfFile" />
      </v-card>
    </section>

    <a style="text-decoration: none" :download="'OFM_Application'" :href="pdfDownloadLink">
      <AppButton size="medium" width="240px" class="mt-2" :loading="loading">Download PDF</AppButton>
    </a>

    <AppBackButton id="back-button" width="300px" :to="{ name: 'applications-history' }">Applications</AppBackButton>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import alertMixin from '@/mixins/alertMixin'
import AppButton from '@/components/ui/AppButton.vue'
import ApplicationService from '@/services/applicationService'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'

import VuePdfEmbed from 'vue-pdf-embed'

// essential styles
import 'vue-pdf-embed/dist/style/index.css'

export default {
  name: 'ViewPdf',
  components: { AppBackButton, AppButton, OrganizationHeader, VuePdfEmbed },
  mixins: [alertMixin],
  data() {
    return {
      pdfFile: undefined,
      pdfDownloadLink: undefined,
      loading: false,
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },

  async created() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      try {
        this.loading = true
        const resp = await ApplicationService.getApplicationPDF(this.$route.params.applicationGuid)
        this.pdfFile = {
          data: atob(resp),
        }
        this.pdfDownloadLink = `data:application/pdf;base64,${resp}`
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
