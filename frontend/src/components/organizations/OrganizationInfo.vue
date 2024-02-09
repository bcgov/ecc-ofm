<template>
  <v-card class="my-4 pa-4" variant="outlined">
    <v-skeleton-loader :loading="isLoading()" type="table-tbody">
      <v-container fluid class="pa-0">
        <v-form ref="organizationForm" v-model="isFormComplete">
          <v-row no-gutters>
            <v-col cols="11" md="6" lg="6">
              <v-card variant="flat">
                <v-row no-gutters>
                  <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Organization legal name:</AppLabel>
                  </v-col>
                  <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                    <v-text-field v-if="editMode" id="name" v-model.trim="organizationEdit.name" variant="outlined" density="compact" :readonly="true" :disabled="isLoading() || editable"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.name }}
                    </template> </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Doing business as:</AppLabel>
                  </v-col>
                  <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                    <v-text-field v-if="editMode" id="businessType" v-model.trim="organizationEdit.businessType" variant="outlined" density="compact" :readonly="true" :disabled="isLoading() || editable"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.businessType }}
                    </template>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Email address:</AppLabel>
                  </v-col>
                  <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                    <v-text-field v-if="editMode" id="email" v-model.trim="organizationEdit.email" variant="outlined" density="compact" :rules="rules.email" :disabled="isLoading()"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.email }}
                    </template>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Phone (landline):</AppLabel>
                  </v-col>
                  <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                    <v-text-field v-if="editMode" id="phoneLandline" v-model.trim="organizationEdit.phoneLandline" variant="outlined" density="compact" :rules="[rules.phone]" :disabled="isLoading()"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.phoneLandline }}
                    </template>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Phone (cell):</AppLabel>
                  </v-col>
                  <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                    <v-text-field v-if="editMode" id="phoneCell" v-model.trim="organizationEdit.phoneCell" variant="outlined" density="compact" :rules="[rules.phone]" :disabled="isLoading()"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.phoneCell }}
                    </template>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="11" md="6" lg="6">
              <v-card variant="flat">
                <v-row no-gutters>
                  <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Mailing Address:</AppLabel>
                  </v-col>
                  <v-col></v-col>
                  <v-col v-if="editable" cols="11" sm="8" md="8" lg="8" class="ma-2">
                    <v-row no-gutters justify="end">
                      <v-icon v-show="!editMode" icon="fa:fa-regular fa-pen-to-square" @click="toggleEditMode()"></v-icon>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Street Address 1:</AppLabel>
                  </v-col>
                  <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                    <v-text-field v-if="editMode" id="mailingStreetAddress1" v-model.trim="organizationEdit.mailingStreetAddress1" variant="outlined" density="compact" :readonly="true" :disabled="isLoading() || editable"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.isMailingAddressDifferent ? organizationReadOnly?.mailingStreetAddress1 : organizationReadOnly?.streetAddress1 }}
                    </template>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Street Address 2:</AppLabel>
                  </v-col>
                  <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                    <v-text-field v-if="editMode" id="mailingStreetAddress2" v-model.trim="organizationEdit.mailingStreetAddress2" variant="outlined" density="compact" :readonly="true" :disabled="isLoading() || editable"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.isMailingAddressDifferent ? organizationReadOnly?.mailingStreetAddress2 : organizationReadOnly?.streetAddress2 }}
                    </template>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="auto" sm="auto" md="auto" lg="auto" class="ma-2">
                    <AppLabel>City:</AppLabel>
                  </v-col>
                  <v-col cols="3" class="ma-2">
                    <v-text-field v-if="editMode" id="mailingCity" v-model.trim="organizationEdit.mailingCity" variant="outlined" density="compact" :readonly="true" :disabled="isLoading() || editable"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.isMailingAddressDifferent ? organizationReadOnly?.mailingCity : organizationReadOnly?.city }}
                    </template>
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <AppLabel>Prov:</AppLabel>
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <v-text-field v-if="editMode" id="mailingProv" v-model.trim="organizationEdit.mailingProvince" variant="outlined" density="compact" :readonly="true" :disabled="isLoading() || editable"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.isMailingAddressDifferent ? organizationReadOnly?.mailingProvince : organizationReadOnly?.province }}
                    </template>
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <AppLabel>Postal Code:</AppLabel>
                  </v-col>
                  <v-col cols="2" class="ma-2">
                    <v-text-field v-if="editMode" id="mailingPostalCode" v-model.trim="organizationEdit.mailingPostalCode" variant="outlined" density="compact" :readonly="true" :disabled="isLoading() || editable"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.isMailingAddressDifferent ? organizationReadOnly?.mailingPostalCode : organizationReadOnly?.postalCode }}
                    </template>
                  </v-col>
                </v-row>
                <v-row><v-col></v-col></v-row>
                <v-row no-gutters>
                  <v-col cols="11" sm="3" class="ma-2">
                    <AppLabel>Physical Address:</AppLabel>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Street Address 1:</AppLabel>
                  </v-col>
                  <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                    <v-text-field v-if="editMode" id="streetAddress1" v-model.trim="organizationEdit.streetAddress1" variant="outlined" density="compact" :readonly="true" :disabled="isLoading() || editable"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.streetAddress1 }}
                    </template>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="11" sm="3" md="2" lg="3" class="ma-2">
                    <AppLabel>Street Address 2:</AppLabel>
                  </v-col>
                  <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                    <v-text-field v-if="editMode" id="streetAddress2" v-model.trim="organizationEdit.streetAddress2" variant="outlined" density="compact" :readonly="true" :disabled="isLoading() || editable"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.streetAddress2 }}
                    </template>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="auto" class="ma-2">
                    <AppLabel>City:</AppLabel>
                  </v-col>
                  <v-col cols="3" class="ma-2">
                    <v-text-field v-if="editMode" id="city" v-model.trim="organizationEdit.city" variant="outlined" density="compact" :readonly="true" :disabled="isLoading() || editable"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.city }}
                    </template>
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <AppLabel>Prov:</AppLabel>
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <v-text-field v-if="editMode" id="province" v-model.trim="organizationEdit.province" variant="outlined" density="compact" :readonly="true" :disabled="isLoading() || editable"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.province }}
                    </template>
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <AppLabel>Postal Code:</AppLabel>
                  </v-col>
                  <v-col cols="2" class="ma-2">
                    <v-text-field v-if="editMode" id="postalCode" v-model.trim="organizationEdit.postalCode" variant="outlined" density="compact" :readonly="true" :disabled="isLoading() || editable"></v-text-field>
                    <template v-else>
                      {{ organizationReadOnly?.postalCode }}
                    </template>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-if="editMode">
            <v-col cols="11" class="d-flex justify-end">
              <AppButton id="cancel-edit" :primary="false" size="large" width="200px" @click="toggleEditMode()" :loading="isLoading()" class="mr-6">Cancel</AppButton>
              <AppButton id="save" size="large" width="200px" @click="update()" :loading="isLoading()">Save</AppButton>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import alertMixin from '@/mixins/alertMixin'
import OrganizationService from '@/services/organizationService'
import AppLabel from '@/components/ui/AppLabel.vue'
import AppButton from '@/components/ui/AppButton.vue'
import rules from '@/utils/rules'

export default {
  components: { AppButton, AppLabel },
  mixins: [alertMixin],
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    organization: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isFormComplete: false,
      organizationReadOnly: undefined,
      organizationEdit: undefined,
      localLoading: false,
      rules,
      editMode: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
  async updated() {
    this.organizationReadOnly = JSON.parse(JSON.stringify(this.organization))
  },
  methods: {
    async update() {
      this.$refs.organizationForm?.validate()
      if (!this.isFormComplete) {
        return
      }
      try {
        this.localLoading = true
        await OrganizationService.updateOrganization(this.userInfo?.organizationId, this.organizationEdit)
        this.organizationReadOnly = { ...this.organizationEdit }
        this.editMode = false
        this.setSuccessAlert('Organization information updated successfully')
      } catch (error) {
        this.setFailureAlert('Failed to get your organization information', error)
      } finally {
        this.localLoading = false
      }
    },

    toggleEditMode() {
      this.organizationEdit = JSON.parse(JSON.stringify(this.organization))
      this.editMode = !this.editMode
    },

    isLoading() {
      return this.loading || this.localLoading
    },

  },
}
</script>
