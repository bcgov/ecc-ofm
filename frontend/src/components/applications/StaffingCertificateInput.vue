<template>
  <v-form ref="form">
    <v-row no-gutters class="mt-8">
      <v-col v-for="(certificate, index) in certificates" :key="index" cols="12" sm="6" lg="4" xl="3" class="px-6 px-lg-8 mb-2" align="center">
        <v-row no-gutters>
          <v-col cols="12" sm="1" class="pt-2">{{ index + 1 }}.</v-col>
          <v-col cols="12" sm="4" class="pt-1">
            <v-text-field
              v-model.trim="certificate.initials"
              variant="outlined"
              density="compact"
              :disabled="readonly"
              placeholder="Initials"
              maxlength="4"
              rounded="0"
              :rules="rules.required"
              :error-messages="getErrorMessagesForDuplicateError(certificate.isInitialsDuplicate)"
              @input="update(certificate)"
              @blur="checkDuplicateInitials" />
          </v-col>
          <v-col cols="12" sm="6" class="pt-1">
            <v-text-field
              v-model="certificate.certificateNumber"
              variant="outlined"
              density="compact"
              :disabled="readonly"
              :placeholder="certificateNumberPlaceholder"
              maxlength="6"
              rounded="0"
              :rules="rules.required"
              :error-messages="getErrorMessagesForDuplicateError(certificate.isCertificateNumberDuplicate)"
              @input="update(certificate)"
              @blur="checkDuplicateCertificateNumbers" />
          </v-col>
          <v-col v-if="certificate.initials || certificate.certificateNumber" cols="12" sm="1" class="pl-3" align="center">
            <v-btn icon="mdi-trash-can-outline" variant="text" @click="remove(index)" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { isEmpty } from 'lodash'
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import rules from '@/utils/rules'
import { sanitizeWholeNumberInput } from '@/utils/common'
import { APPLICATION_PROVIDER_EMPLOYEE_TYPES } from '@/utils/constants'

export default {
  name: 'StaffingCertificateInput',
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    employeeCount: {
      type: Number,
      default: 0,
    },
    employeeType: {
      type: Number,
      required: true,
    },
    allCertificates: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      certificates: [],
    }
  },

  computed: {
    ...mapState(useApplicationsStore, ['validation']),

    certificateNumberPlaceholder() {
      if (this.employeeType === APPLICATION_PROVIDER_EMPLOYEE_TYPES.ECEA) {
        return 'ECEA certificate number'
      }
      return 'ECE certificate number'
    },
  },

  watch: {
    employeeCount: {
      handler(value) {
        if (this.certificates?.length < value) {
          while (this.certificates?.length < value) {
            this.addBlankCertificate()
          }
        } else if (this.certificates?.length > value) {
          this.removeRedundantBlankCertificates(value)
        }
      },
    },
    allCertificates: {
      async handler() {
        await this.validateCertificates()
      },
      deep: true,
    },
  },

  async created() {
    this.rules = rules
    this.initializeCertificates()
  },

  async mounted() {
    await this.validateCertificates()
  },

  methods: {
    initializeCertificates() {
      this.certificates = this.allCertificates?.filter((certificate) => certificate.employeeType === this.employeeType)
      while (this.certificates?.length < this.employeeCount) {
        this.addBlankCertificate()
      }
    },

    update(certificate) {
      certificate.initials = certificate.initials?.toUpperCase()
      certificate.certificateNumber = sanitizeWholeNumberInput(certificate.certificateNumber)
      if (certificate.providerEmployeeId) {
        certificate.isUpdated = true
      }
      this.$emit('update:modelValue', this.certificates)
    },

    remove(index) {
      this.certificates?.splice(index, 1)
      if (this.certificates?.length < this.employeeCount) {
        this.addBlankCertificate()
      }
      this.$emit('update:modelValue', this.certificates)
    },

    addBlankCertificate() {
      this.certificates.push({
        applicationId: this.$route.params.applicationGuid,
        initials: '',
        certificateNumber: '',
        employeeType: this.employeeType,
      })
    },

    removeRedundantBlankCertificates(count) {
      let index = this.certificates?.findIndex((cert) => isEmpty(cert.initials) && isEmpty(cert.certificateNumber))
      while (this.certificates?.length > count && index > -1) {
        this.certificates?.splice(index, 1)
        index = this.certificates?.findIndex((cert) => isEmpty(cert.initials) && isEmpty(cert.certificateNumber))
      }
    },

    async validateCertificates() {
      if (this.validation) {
        this.checkDuplicateInitials()
        this.checkDuplicateCertificateNumbers()
        await this.$refs.form?.validate()
      }
    },

    checkDuplicateInitials() {
      this.allCertificates?.forEach((certificate) => {
        if (!certificate.initials) return
        const found = this.allCertificates?.filter((item) => item.initials === certificate.initials)
        certificate.isInitialsDuplicate = found?.length > 1
      })
    },

    checkDuplicateCertificateNumbers() {
      this.allCertificates?.forEach((certificate) => {
        if (!certificate.certificateNumber) return
        const found = this.allCertificates?.filter((item) => item.certificateNumber === certificate.certificateNumber)
        certificate.isCertificateNumberDuplicate = found?.length > 1
      })
    },

    getErrorMessagesForDuplicateError(isDuplicate) {
      return !this.readonly && isDuplicate ? ['This field is duplicate'] : []
    },
  },
}
</script>
