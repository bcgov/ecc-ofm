<template>
  <v-form ref="form">
    <v-row no-gutters class="mt-8">
      <v-col v-for="(certificate, index) in certificates" :key="index" cols="12" md="6" lg="4" xl="3" class="px-6 px-lg-8 mb-2" align="center">
        <v-row no-gutters>
          <v-col cols="12" sm="1" class="pt-2">{{ index + 1 }}.</v-col>
          <v-col cols="12" sm="4">
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
          <v-col cols="12" sm="6">
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
          <v-col v-if="!readonly && (certificate.initials || certificate.certificateNumber)" cols="12" sm="1">
            <v-btn variant="text" @click="remove(index)">
              <v-icon icon="mdi-trash-can-outline" size="large" />
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { isEmpty, cloneDeep } from 'lodash'
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

  emits: ['update'],

  data() {
    return {
      certificates: [],
    }
  },

  computed: {
    ...mapState(useApplicationsStore, ['validation']),

    certificateNumberPlaceholder() {
      if (this.employeeType === APPLICATION_PROVIDER_EMPLOYEE_TYPES.ECEA) {
        return 'ECEA certificate #'
      }
      return 'ECE certificate #'
    },

    filteredCertificates() {
      return this.allCertificates?.filter((certificate) => certificate.employeeType === this.employeeType)
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
    filteredCertificates: {
      async handler() {
        this.initializeCertificates()
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
      this.certificates = cloneDeep(this.filteredCertificates)
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
      this.$emit('update', this.certificates)
    },

    remove(index) {
      this.certificates?.splice(index, 1)
      if (this.certificates?.length < this.employeeCount) {
        this.addBlankCertificate()
      }
      this.$emit('update', this.certificates)
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
      this.checkDuplicateInitials()
      this.checkDuplicateCertificateNumbers()
      if (this.validation) {
        await this.$refs.form?.validate()
      }
    },

    checkDuplicateInitials() {
      this.allCertificates?.forEach((certificate) => {
        if (!certificate.initials) {
          certificate.isInitialsDuplicate = false
          return
        }
        const found = this.allCertificates?.filter((item) => item.initials === certificate.initials)
        certificate.isInitialsDuplicate = found?.length > 1
      })
    },

    checkDuplicateCertificateNumbers() {
      this.allCertificates?.forEach((certificate) => {
        if (!certificate.certificateNumber) {
          certificate.isCertificateNumberDuplicate = false
          return
        }
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
