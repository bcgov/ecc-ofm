<template>
  <OrganizationHeader :show-facility="false" />
  <v-container fluid>
    <h1>Help and Resources</h1>
    <v-row no-gutters class="my-6">
      <v-col cols="12" class="d-flex flex-column align-start">
        <AppButton v-if="isEmpty(generalPanels) && isEmpty(testParticipantPanels)" id="expand-button" :primary="false" size="large" width="200px" @click="togglePanel">
          <v-icon>mdi-arrow-expand-vertical</v-icon>
          Expand All
        </AppButton>
        <AppButton v-else id="collapse-button" :primary="false" size="large" width="200px" @click="togglePanel">
          <v-icon>mdi-arrow-collapse-vertical</v-icon>
          Collapse All
        </AppButton>
      </v-col>
    </v-row>
    <h3 class="mt-4 ml-1">General</h3>
    <v-expansion-panels v-model="generalPanels" multiple>
      <v-expansion-panel v-for="panelComponent in GENERAL_PANELS" :key="panelComponent.id" :value="panelComponent.id">
        <v-expansion-panel-title>
          <span class="supplementary-header-label">{{ panelComponent.title }}</span>
        </v-expansion-panel-title>
        <v-expansion-panel-text v-if="panelComponent.id === 'faq'">
          <a href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/10-a-day-childcarebc-centres/faq-child-care-providers" target="_blank">
            <v-icon size="20" icon="mdi-link-variant" class="mr-1"></v-icon>
            <span>$10 a Day Program Frequently Asked Questions - Province of British Columbia (gov.bc.ca)</span>
          </a>
          <br />
          <br />
          <a href="https://www2.gov.bc.ca/assets/download/2487215BAFC64F07927996FF988CDADD" target="_blank">
            <v-icon size="18" icon="fa:fa-regular fa-file-pdf" class="mr-1"></v-icon>
            <span>2024 - OFM Core Discretionary Allowances Factsheet</span>
          </a>
          <br />
          <br />
          <a href="https://www2.gov.bc.ca/assets/download/1BE4023D70984A41B0DC0DE7C87947E0" target="_blank">
            <v-icon size="18" icon="fa:fa-regular fa-file-pdf" class="mr-1"></v-icon>
            <span>Portal Provider Guide</span>
          </a>
        </v-expansion-panel-text>
        <v-expansion-panel-text v-if="panelComponent.id === 'additional'">
          <a href="https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/10-a-day-childcarebc-centres" target="_blank">
            <v-icon size="20" icon="mdi-link-variant" class="mr-1"></v-icon>
            <span>$10 a Day ChildCareBC Centres Website - Province of British Columbia (gov.bc.ca)</span>
          </a>
          <br />
          <br />
          <a
            href="https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/internal-corporate-services/finance-forms/fin-312-direct-deposit-application.pdf"
            target="_blank">
            <v-icon size="18" icon="fa:fa-regular fa-file-pdf" class="mr-1"></v-icon>
            <span>Direct Deposit Application - FIN 312</span>
          </a>
          <br />
          <br />
          <a href="https://www2.gov.bc.ca/assets/download/3AA38815DECE4E15BB01798ED40FF17C" target="_blank">
            <v-icon size="18" icon="fa:fa-regular fa-file-pdf" class="mr-1"></v-icon>
            <span>Funding Agreement Infographic</span>
          </a>
          <br />
          <br />
          <a href="https://www2.gov.bc.ca/assets/download/118432D8D0A7481E96BA681CE174BA41">
            <v-icon size="18" icon="fa:fa-regular fa-file-excel" class="mr-1"></v-icon>
            <span>Program Specific Statement of Operations Template </span>
          </a>
          <br />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <h3 class="mt-8 ml-1">$10 a Day Participants</h3>
    <v-expansion-panels v-model="testParticipantPanels" multiple>
      <v-expansion-panel v-for="panelComponent in TEST_PARTICIPANT_PANELS" :key="panelComponent.id" :value="panelComponent.id">
        <v-expansion-panel-title>
          <span class="supplementary-header-label">{{ panelComponent.title }}</span>
        </v-expansion-panel-title>
        <v-expansion-panel-text v-if="panelComponent.id === 'manuals'">
          <a href="https://www2.gov.bc.ca/assets/download/2215735D9D5540079294C5B032864123" target="_blank">
            <v-icon size="18" icon="fa:fa-regular fa-file-pdf" class="mr-1"></v-icon>
            <span>2024 - Policy and Procedure Manual</span>
          </a>
          <br />
          <br />
          <a href="https://www2.gov.bc.ca/assets/download/C03595E2D4AC467D94D0464C52C7A907" target="_blank">
            <v-icon size="18" icon="fa:fa-regular fa-file-pdf" class="mr-1"></v-icon>
            <span>2024 - Funding Agreement Template</span>
          </a>
          <br />
          <br />
          <a href="https://www2.gov.bc.ca/assets/download/D10A0045B4724B81A235A2CE418F29DB" target="_blank">
            <v-icon size="18" icon="fa:fa-regular fa-file-pdf" class="mr-1"></v-icon>
            <span>Applicant Guide</span>
          </a>
        </v-expansion-panel-text>
        <v-expansion-panel-text v-if="panelComponent.id === 'training'">
          <a href="https://rise.articulate.com/share/_eN8nAZYN7_Jmi9tpG69W6dcza6aHsXZ#/" target="_blank">
            <v-icon size="20" icon="mdi-link-variant" class="mr-1"></v-icon>
            <span>Funding Agreement Training e-Module</span>
          </a>
          <br />
          <br />
          <a href="https://rise.articulate.com/share/4IlRwcyWDpuotLtH71zjj_czAkUUsPOw#/" target="_blank">
            <v-icon size="20" icon="mdi-link-variant" class="mr-1"></v-icon>
            <span>Policy and Procedure Manual Training e-Module</span>
          </a>
        </v-expansion-panel-text>
        <v-expansion-panel-text v-if="panelComponent.id === 'other'">
          <a href="https://www2.gov.bc.ca/assets/download/CAF7A4B7BB5248838968459A0BBD6CC2" target="_blank">
            <v-icon size="18" icon="fa:fa-regular fa-file-pdf" class="mr-1"></v-icon>
            <span>EE $10 a Day Policy and Procedure Manual</span>
          </a>
          <br />
          <br />
          <a href="https://www2.gov.bc.ca/assets/download/37637565F3824721A91EE6D0ED0F1D7C" target="_blank">
            <v-icon size="18" icon="fa:fa-regular fa-file-pdf" class="mr-1"></v-icon>
            <span>EE $10 a Day Funding Agreement Template</span>
          </a>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <AppBackButton id="back-home-button" size="large" width="220px" :to="{ name: 'home' }" class="mt-6">Home</AppBackButton>
  </v-container>
</template>

<script>
import AppBackButton from '@/components/ui/AppBackButton.vue'
import AppButton from '@/components/ui/AppButton.vue'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import { isEmpty } from 'lodash'

export default {
  components: { AppBackButton, AppButton, OrganizationHeader },
  data() {
    return {
      generalPanels: [],
      testParticipantPanels: [],
    }
  },
  computed: {
    allGeneralPanelIDs() {
      return this.GENERAL_PANELS.map((panel) => panel.id)
    },
    allTestParticipantPanelIDs() {
      return this.TEST_PARTICIPANT_PANELS.map((panel) => panel.id)
    },
  },
  created() {
    this.GENERAL_PANELS = [
      {
        title: 'Frequently Asked Questions',
        id: 'faq',
      },
      {
        title: 'Additional Resources',
        id: 'additional',
      },
    ]
    this.TEST_PARTICIPANT_PANELS = [
      {
        title: 'Supporting Materials',
        id: 'manuals',
      },
      {
        title: 'Training e-Modules',
        id: 'training',
      },
      {
        title: 'Other',
        id: 'other',
      },
    ]
    this.generalPanels = this.allGeneralPanelIDs
    // OFMCC-6203 - Other section will be collapsed by default
    this.testParticipantPanels = this.allTestParticipantPanelIDs.slice(0, -1)
  },
  methods: {
    isEmpty,
    togglePanel() {
      const isAllCollapsed = isEmpty(this.generalPanels) && isEmpty(this.testParticipantPanels)
      this.generalPanels = isAllCollapsed ? this.allGeneralPanelIDs : []
      this.testParticipantPanels = isAllCollapsed ? this.allTestParticipantPanelIDs : []
    },
  },
}
</script>
