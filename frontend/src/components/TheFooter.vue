<template>
  <v-footer absolute color="#003366">
    <v-container fluid class="footer-container">
      <v-row no-gutters class="territorial-row">
        <v-col>
          <p>
            The B.C. Public Service acknowledges the territories of First Nations around B.C. and is grateful to carry
            out our work on these lands. We acknowledge the rights, interests, priorities, and concerns of all
            Indigenous Peoples - First Nations, Métis, and Inuit - respecting and acknowledging their distinct cultures,
            histories, rights, laws, and governments.
          </p>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="d-flex flex-wrap justify-center">
          <v-btn id="footer-home" variant="text" color="white" href="https://www.gov.bc.ca/">Home</v-btn>
          <v-btn
            id="footer-about"
            variant="text"
            color="white"
            href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca">
            About gov.bc.ca
          </v-btn>
          <v-btn id="footer-disclaimer" variant="text" color="white" href="http://gov.bc.ca/disclaimer">
            Disclaimer
          </v-btn>
          <v-btn id="footer-privacy" variant="text" color="white" href="http://gov.bc.ca/privacy">Privacy</v-btn>
          <v-btn id="footer-accessibility" variant="text" color="white" href="http://gov.bc.ca/webaccessibility">
            Accessibility
          </v-btn>
          <v-btn id="footer-copyright" variant="text" color="white" href="http://gov.bc.ca/copyright">Copyright</v-btn>
          <v-btn
            id="footer-contact"
            variant="text"
            color="white"
            href="https://www2.gov.bc.ca/gov/content/home/contact-us">
            Contact Us
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style>
.v-footer {
  border-top: 2px solid rgb(252, 186, 25) !important;
  min-width: 100%;
  flex-grow: 0;
  font-size: 14px;
  padding: 0px;
}

.v-btn--active.footer:before,
.v-btn.footer:focus:before,
.v-btn.footer:hover:before {
  background: none;
}

.footer-container {
  padding: 0px;
}

.link-row {
  padding: 8px;
}

.territorial-row {
  border-bottom: 1px solid #ffffff;
  padding: 8px 16px;
  text-align: center;
}
</style>
