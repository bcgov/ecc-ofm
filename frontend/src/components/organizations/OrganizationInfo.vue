<template>
  <v-card class="my-4 pa-4" variant="outlined">
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-container fluid class="pa-0">
        <v-form ref="userForm" v-model="isFormComplete">
          <v-row no-gutters>
            <v-col cols="9" md="6">
              <v-row no-gutters class="ma-2">
                <v-col cols="12" md="6" lg="5" xl="4">
                  <AppLabel>Organization legal name:</AppLabel>
                </v-col>
                <v-col cols="12" md="6" lg="7" xl="8">
                  <!--template v-if="editMode">
                  <v-text-field id="orgLegalName" v-model="organizationInfo.name" placeholder="Organization legal name" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                </template>
                <template v-else -->
                  {{ organizationInfo?.name }}
                  <!--/template-->
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="editable" cols="3" md="6">
              <v-row no-gutters justify="end">
                <v-icon v-show="!editMode" icon="fa:fa-regular fa-pen-to-square" @click="toggleEditMode()" class="mr-4"></v-icon>
              </v-row>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-row no-gutters class="ma-2">
                <v-col cols="12" md="6" lg="5" xl="4">
                  <AppLabel>Doing business as:</AppLabel>
                </v-col>
                <v-col cols="12" md="6" lg="7" xl="8">
                  <!--template v-if="editMode">
                  <v-text-field id="businessType" v-model="organizationInfo.businessType" placeholder="Doing business as" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                </template>
                <template v-else-->
                  {{ organizationInfo?.businessType }}
                  <!--/template-->
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters class="ma-2">
                <v-col cols="12" md="6" lg="5" xl="4">
                  <AppLabel>Email address:</AppLabel>
                </v-col>
                <v-col cols="12" md="6" lg="7" xl="8">
                  <template v-if="editMode">
                    <v-text-field id="email" v-model="organizationInfo.email" placeholder="Email Address" variant="outlined" density="compact" :rules="rules.email" :disabled="loading"></v-text-field>
                  </template>
                  <template v-else>
                    {{ organizationInfo?.email }}
                  </template>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-row no-gutters class="ma-2">
                <v-col cols="12" md="6" lg="5" xl="4">
                  <AppLabel>Phone (landline):</AppLabel>
                </v-col>
                <v-col cols="12" md="6" lg="7" xl="8">
                  <template v-if="editMode">
                    <v-text-field id="phoneLandline" v-model="organizationInfo.phoneLandline" placeholder="Phone (landline)" variant="outlined" density="compact" :rules="[rules.phone]" :disabled="loading"></v-text-field>
                  </template>
                  <template v-else>
                    {{ organizationInfo?.phoneLandline }}
                  </template>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters class="ma-2">
                <v-col cols="12" md="6" lg="5" xl="4">
                  <AppLabel>Phone (cell):</AppLabel>
                </v-col>
                <v-col cols="12" md="6" lg="7" xl="8">
                  <template v-if="editMode">
                    <v-text-field id="phoneCell" v-model="organizationInfo.phoneCell" placeholder="Phone (cell)" variant="outlined" density="compact" :rules="[rules.phone]" :disabled="loading"></v-text-field>
                  </template>
                  <template v-else>
                    {{ organizationInfo?.phoneCell }}
                  </template>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider />
          <v-row no-gutters>
            <v-col cols="12">
              <v-row no-gutters class="ma-2">
                <h4>Physical address</h4>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" md="6">
                  <v-row no-gutters class="ma-2">
                    <v-col cols="12" md="6" lg="5" xl="4">
                      <AppLabel>Street address 1:</AppLabel>
                    </v-col>
                    <v-col cols="12" md="6" lg="7" xl="8">
                      <!--template v-if="editMode">
                      <v-text-field id="streetAddress1" v-model="organizationInfo.streetAddress1" placeholder="Street Address 1" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                      {{ organizationInfo?.streetAddress1 }}
                      <!--/template-->
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row no-gutters class="ma-2">
                    <v-col cols="12" md="6" lg="5" xl="4">
                      <AppLabel>Street address 2:</AppLabel>
                    </v-col>
                    <v-col cols="12" md="6" lg="7" xl="8">
                      <!--template v-if="editMode">
                      <v-text-field id="streetAddress2" v-model="organizationInfo.streetAddress2" placeholder="Street Address 2" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                      {{ organizationInfo?.streetAddress2 }}
                      <!--/template-->
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" md="6">
                  <v-row no-gutters class="ma-2">
                    <v-col cols="12" md="6" lg="5" xl="4">
                      <AppLabel>City:</AppLabel>
                    </v-col>
                    <v-col cols="12" md="6" lg="7" xl="8">
                      <!--template v-if="editMode">
                      <v-text-field id="city" v-model="organizationInfo.city" placeholder="City" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                      {{ organizationInfo?.city }}
                      <!--/template-->
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row no-gutters class="ma-2">
                    <v-col cols="12" md="6" lg="5" xl="4">
                      <AppLabel>Province:</AppLabel>
                    </v-col>
                    <v-col cols="12" md="6" lg="7" xl="8">
                      {{ organizationInfo?.province }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row no-gutters class="ma-2">
                    <v-col cols="12" md="6" lg="5" xl="4">
                      <AppLabel>Postal code:</AppLabel>
                    </v-col>
                    <v-col cols="12" md="6" lg="7" xl="8">
                      <!--template v-if="editMode">
                      <v-text-field id="postalCode" v-model="organizationInfo.postalCode" placeholder="Postal code" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                      {{ organizationInfo?.postalCode }}
                      <!--/template-->
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider />
          <v-row no-gutters>
            <v-col cols="12">
              <v-row no-gutters class="ma-2">
                <h4>Mailing address</h4>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" md="6">
                  <v-row no-gutters class="ma-2">
                    <v-col cols="12" md="6" lg="5" xl="4">
                      <AppLabel>Street address 1:</AppLabel>
                    </v-col>
                    <v-col cols="12" md="6" lg="7" xl="8">
                      <!--template v-if="editMode">
                      <v-text-field id="mailingStreetAddress1" v-model="organizationInfo.mailingStreetAddress1" placeholder="Street Address 1" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                      {{ organizationInfo?.mailingStreetAddress1 }}
                      <!--/template-->
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row no-gutters class="ma-2">
                    <v-col cols="12" md="6" lg="5" xl="4">
                      <AppLabel>Street address 2:</AppLabel>
                    </v-col>
                    <v-col cols="12" md="6" lg="7" xl="8">
                      <!--template v-if="editMode">
                      <v-text-field id="mailingStreetAddress2" v-model="organizationInfo.mailingStreetAddress2" placeholder="Street Address 2" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                      {{ organizationInfo?.mailingStreetAddress2 }}
                      <!--/template-->
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" md="6">
                  <v-row no-gutters class="ma-2">
                    <v-col cols="12" md="6" lg="5" xl="4">
                      <AppLabel>City:</AppLabel>
                    </v-col>
                    <v-col cols="12" md="6" lg="7" xl="8">
                      <!--template v-if="editMode">
                      <v-text-field id="mailingCity" v-model="organizationInfo.mailingCity" placeholder="City" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                      {{ organizationInfo?.mailingStreetAddress1 }}
                      <!--/template-->
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row no-gutters class="ma-2">
                    <v-col cols="12" md="6" lg="5" xl="4">
                      <AppLabel>Province:</AppLabel>
                    </v-col>
                    <v-col cols="12" md="6" lg="7" xl="8">
                      {{ organizationInfo?.isMailingAddressDifferent ? organizationInfo?.mailingProvince : organizationInfo?.province }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row no-gutters class="ma-2">
                    <v-col cols="12" md="6" lg="5" xl="4">
                      <AppLabel>Postal code:</AppLabel>
                    </v-col>
                    <v-col cols="12" md="6" lg="7" xl="8">
                      <!--template v-if="editMode">
                      <v-text-field id="mailingPostalCode" v-model="organizationInfo.mailingPostalCode" placeholder="Postal code" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                      {{ organizationInfo?.mailingPostalCode }}
                      <!--/template-->
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-if="editMode">
            <v-col cols="12" class="d-flex justify-center">
              <AppButton id="cancel-edit" :primary="false" size="large" width="200px" @click="cancel()" :loading="loading" class="mr-6">Cancel</AppButton>
              <AppButton id="save" size="large" width="200px" @click="update()" :loading="loading">Save</AppButton>
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
  },
  data() {
    return {
      isFormComplete: false,
      organizationInfo: undefined,
      loading: false,
      rules,
      editMode: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
  async created() {
    await this.loadOrganizationInfo()
  },
  methods: {
    async loadOrganizationInfo() {
      try {
        this.loading = true
        this.organizationInfo = await OrganizationService.getOrganization(this.userInfo?.organizationId)
      } catch (error) {
        this.setFailureAlert('Failed to get your organization information', error)
      } finally {
        this.loading = false
      }
    },

    async update() {
      this.$refs.userForm?.validate()
      if (!this.isFormComplete) {
        return
      }
      try {
        this.loading = true
        await OrganizationService.updateOrganization(this.userInfo?.organizationId, this.organizationInfo)
        this.editMode = false
        this.setSuccessAlert('Organization information updated successfully')
      } catch (error) {
        this.setFailureAlert('Failed to get your organization information', error)
      } finally {
        this.loading = false
      }
    },

    cancel() {
      this.editMode = false
      this.$refs.userForm?.reset()
    },

    toggleEditMode() {
      this.editMode = !this.editMode
    },



  },
}
</script>
