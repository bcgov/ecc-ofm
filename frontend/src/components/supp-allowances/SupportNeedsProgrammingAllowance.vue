<template>
  <AppAlertBanner v-if="isWarningDisplayed && hasInclusionPolicy" type="info">You have already received the Support Needs Allowance for the current year.</AppAlertBanner>
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <AppAlertBanner v-if="!hasInclusionPolicy" type="info">
        Providers are encouraged to use this funding in accordance with their inclusion policy. Providers may also consult with their local SCD program to inquire how it may be used.
      </AppAlertBanner>
      <AppLabel>Purpose of the Fund:</AppLabel>
      To help child care providers welcome children and families of all abilities by covering costs related to inclusion that may not be covered by base funding or other provincial funding. Children
      with support needs, including those with disabilities, neurodiversity, or behaviors that challenge staff, may need additional support, accommodations, or program modifications to participate
      meaningfully alongside other children.
      <br />
      <br />
      <AppLabel>Eligible expenses:</AppLabel>
      Equipment, program resources, or minor Facility modifications to enhance inclusion for all children in the participant's programming.
      <br />
      <br />
      <AppLabel>Ineligible expenses include:</AppLabel>
      Staffing enhancements including support workers; individualized, therapeutic, or medical equipment.
      <br />
      <br />
      Providers can contact their local
      <a href="https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/early-childhood-intervention" target="_blank">
        Supported Child Development or Aboriginal Supported Child Development
      </a>
      programs for suggestions on how to use this funding.
    </v-col>
  </v-row>
  <br />
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <strong>An Inclusion Policy is a requirement to apply for Support Needs Allowance.</strong>
      You can upload your policy in
      <router-link :to="{ name: 'manage-organization' }">Account Management.</router-link>
    </v-col>
  </v-row>
  <br />
  <v-row no-gutters class="mr-2 my-2">
    <AppButton v-if="!showMore" class="link-btn" variant="text" @click="toggleInclusionPolicyDiv">Read More</AppButton>
  </v-row>
  <div v-if="showMore" class="my-4">
    <AppLabel>What is an Inclusion Policy?</AppLabel>
    <br />
    <br />
    An Inclusion Policy is intended to support child care providers in describing how their program provides inclusive child care. It supports early childhood professionals' reflective practice and
    should evolve over time as the child care program evolves. An Inclusion Policy outlines the steps child care providers and early childhood professionals will take to prevent or reduce the
    exclusion or termination of children from the child care program; it is not a requirement for providers to accept all children into their program. Child care providers may access a number of
    resources to help them to develop and implement an Inclusion Policy for their program.
    <br />
    <br />
    <ol>
      <li class="mx-5">
        The
        <a href="https://www2.gov.bc.ca/assets/download/4E6FA25EBD15485E81C402B9FED01870" target="_blank">Inclusive Child Care Toolkit:</a>
        provides resources to help providers and early childhood professionals develop an understanding of inclusive child care practices, and provides information on how to develop an Inclusion
        Policy.
      </li>
      <br />
      <li class="mx-5">
        Online training courses:
        <a href="https://bcearlyyearshub.ca/courses/foundations-inclusive-child-care-training/" target="_blank">Foundations of Inclusive Child Care</a>
        and Behaviour in the Early Years (launching on the BC Early Years Professional Hub in late November 2023).
      </li>
      <br />
      <li class="mx-5">
        Local Supported Child Development (SCD) and Aboriginal Supported Child Development (ASCD) programs: these programs may be able to provide consultation services for child care providers.
      </li>
      <br />
      <li class="mx-5">
        Child Care Resource and Referral Centres (CCRR) and the Early Childhood Pedagogy Network (ECPN): these programs may have locally-available resources to support child care providers in
        developing an Inclusion Policy.
      </li>
    </ol>
  </div>
  <v-row no-gutters class="mr-2 my-2 d-flex flex-column align-end">
    <AppButton v-if="showMore" class="link-btn" variant="text" @click="toggleInclusionPolicyDiv">Show Less</AppButton>
  </v-row>

  <v-divider class="mt-2"></v-divider>
  <div v-if="hasInclusionPolicy">
    <v-row no-gutters class="mr-2 my-2">
      <v-col cols="12">Please describe how you intend to use this funding:</v-col>
    </v-row>
    <v-row v-for="item in SUPPORT_CHECKBOX_LABELS" :key="item.value" no-gutters>
      <v-checkbox v-model="model.supportFundingModel" :disabled="readOnly" density="compact" class="pl-lg-8 mr-0" prepend-icon :value="item.value">
        <template v-slot:label>
          <p>
            {{ item.label }}
            <v-tooltip v-if="item.tooltip" content-class="tooltip" :text="item.tooltip">
              <template #activator="{ props }">
                <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
              </template>
            </v-tooltip>
          </p>
        </template>
      </v-checkbox>
    </v-row>
    <v-row v-if="isOtherBoxDisplayed" no-gutters class="ml-10 mr-2 my-0">
      <v-textarea
        v-model.trim="model.supportOtherDescription"
        :disabled="readOnly"
        placeholder="Detailed description of other expenses"
        counter
        maxlength="1000"
        variant="outlined"
        :rules="rules.required"></v-textarea>
    </v-row>
  </div>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import rules from '@/utils/rules'
import AppButton from '@/components/ui/AppButton.vue'
import { SUPPORT_CHECKBOX_LABELS } from '@/utils/constants/suppConstants'
import { isApplicationLocked } from '@/utils/common'

export default {
  components: { AppAlertBanner, AppButton, AppLabel },
  props: {
    supportModel: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    hasInclusionPolicy: {
      type: Boolean,
      required: true,
      default: () => {
        return false
      },
    },
    formDisabled: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update'],
  data() {
    return {
      model: {},
      rules,
      showMore: false,
    }
  },
  computed: {
    isOtherBoxDisplayed() {
      return this.model?.supportFundingModel?.includes(this.SUPPORT_CHECKBOX_LABELS.find((item) => item.label === 'Other').value)
    },
    readOnly() {
      return isApplicationLocked(this.supportModel?.statusCode) || this.formDisabled
    },
    isWarningDisplayed() {
      return isApplicationLocked(this.supportModel?.statusCode)
    },
  },
  watch: {
    model: {
      handler(value) {
        this.$emit('update', value)
      },
      deep: true,
    },
  },
  async created() {
    this.model = { ...this.supportModel }
    this.SUPPORT_CHECKBOX_LABELS = SUPPORT_CHECKBOX_LABELS
  },
  methods: {
    toggleInclusionPolicyDiv() {
      this.showMore = !this.showMore
    },
  },
}
</script>

<style scoped>
.link-btn {
  text-decoration: underline;
}
</style>
