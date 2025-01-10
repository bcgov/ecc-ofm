<template>
  <v-form ref="form" v-model="isFormComplete">
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <div>
        <p class="mb-5">
          I hereby confirm that the information I have provided in this application is complete and accurate. I certify
          that I have read and understand the following requirements:
        </p>
        <ul class="pl-6">
          <li>Each facility must be licensed under the Community Care and Assisted Living Act;</li>
          <li>
            Each facility must be in compliance with the Community Care and Assisted Living Act and Child Care Licensing
            Regulation;
          </li>
          <li>
            Each facility must be willing to provide services to families who receive the Affordable Child Care Benefit;
          </li>
          <li>
            The organization must be in good standing with BC Corporate Registry (if a nonprofit society or a registered
            company); and
          </li>
          <li>
            The applicant must be in good standing with the Ministry of Education and Child Care (that is, the Applicant
            must either have no outstanding balances owing to the Ministry OR the Applicant must have established
            payment plans for outstanding balances and these must be in good standing).
          </li>
        </ul>
        <p class="my-5">
          Intentionally supplying information that is false or misleading with respect to a material fact in order to
          obtain a child care grant may lead to action being taken under Section 24(2) of the
          <i>Early Learning and Child Care Act</i>
          (ELCCA). If you are convicted of an offence under Section 24(2), a court may order you imprisoned for up to
          six months, fine you not more than $2,000.00, or order you to pay the government all or part of any amount
          received under the child care grant.
        </p>
        <p>
          I consent to the Ministry contacting other branches within the Ministry and other Province ministries to
          validate the accuracy of any information that I have provided.
        </p>
      </div>
      <v-checkbox
        id="declaration"
        v-model="model.applicationDeclaration"
        color="primary"
        :rules="rules.required"
        :disabled="readonly || !isApplicationComplete"
        :hide-details="readonly"
        label="I certify that all of the information provided is true and complete to the best of my knowledge."
        class="my-5"></v-checkbox>
    </v-skeleton-loader>
  </v-form>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useApplicationsStore } from '@/stores/applications'
import { mapState, mapWritableState, mapActions } from 'pinia'
import rules from '@/utils/rules'
import ApplicationService from '@/services/applicationService'
import alertMixin from '@/mixins/alertMixin'
import { APPLICATION_STATUS_CODES, APPLICATION_ROUTES } from '@/utils/constants'

export default {
  name: 'DeclareSubmitView',
  mixins: [alertMixin],

  async beforeRouteLeave(_to, _from, next) {
    if (!this.readonly) {
      await this.saveApplication()
    }
    next(!this.processing) // only go to the next page after saveApplication is complete
  },

  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    back: {
      type: Boolean,
      default: false,
    },
    save: {
      type: Boolean,
      default: false,
    },
    submit: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['process'],

  data() {
    return {
      rules,
      model: {},
      isFormComplete: false,
      processing: false,
      loading: false,
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useApplicationsStore, ['currentApplication', 'isApplicationComplete']),
    ...mapWritableState(useApplicationsStore, ['isDeclareSubmitComplete']),
  },

  watch: {
    isFormComplete: {
      handler(value) {
        this.isDeclareSubmitComplete = value
      },
    },
    back: {
      handler() {
        this.$router.push({
          name: APPLICATION_ROUTES.REVIEW,
          params: { applicationGuid: this.$route.params.applicationGuid },
        })
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    submit: {
      async handler() {
        await this.submitApplication()
      },
    },
  },

  async created() {
    this.$emit('process', false)
    await this.loadData()
    this.model = {
      applicationDeclaration: this.currentApplication?.applicationDeclaration,
    }
  },

  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),

    async loadData() {
      if (this.readonly) return
      try {
        this.$emit('process', true)
        this.loading = true
        await this.getApplication(this.$route.params.applicationGuid)
      } catch (error) {
        this.setFailureAlert('Failed to load the application', error)
      } finally {
        this.loading = false
        this.$emit('process', false)
      }
    },

    async submitApplication() {
      this.model.applicationReviewComplete = true
      this.model.submittedBy = this.userInfo?.contactId
      this.model.statusCode = APPLICATION_STATUS_CODES.SUBMITTED
      await this.saveApplication()
      if (this.currentApplication?.statusCode === APPLICATION_STATUS_CODES.SUBMITTED) {
        this.$router.push({
          name: APPLICATION_ROUTES.CONFIRMATION,
          params: { applicationGuid: this.$route.params.applicationGuid },
        })
      }
    },

    async saveApplication(showAlert = false) {
      try {
        this.$emit('process', true)
        this.processing = true
        if (ApplicationService.isApplicationUpdated(this.model)) {
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, this.model)
          await this.getApplication(this.$route.params.applicationGuid)
        }
        if (showAlert) {
          this.setSuccessAlert('Application saved successfully')
        }
      } catch (error) {
        this.setFailureAlert('Failed to save your application', error)
      } finally {
        this.$emit('process', false)
        this.processing = false
      }
    },
  },
}
</script>
<style scoped>
:deep(.v-label) {
  opacity: 1;
}
</style>
