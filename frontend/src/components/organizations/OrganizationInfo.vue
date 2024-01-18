<template>
  <v-card class="my-4 pa-4" variant="outlined">
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-container fluid class="pa-0">
        <v-form ref="organizationForm" v-model="isFormComplete">
          <v-row no-gutters>
            <v-col cols="12" md="6" lg="6">
              <v-card variant="flat">
                <v-row no-gutters>
                  <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Organization legal name:</AppLabel>
                  </v-col>
                  <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                    <!--template v-if="editMode">
                      <v-text-field id="name" v-model="organizationInfoEdit.name" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                    {{ organizationInfo?.name }}
                    <!--/template--> </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Doing business as:</AppLabel>
                  </v-col>
                  <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                    <!--template v-if="editMode">
                      <v-text-field id="businessType" v-model="organizationInfoEdit.businessType" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                    {{ organizationInfo?.businessType }}
                    <!--/template-->
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Email address:</AppLabel>
                  </v-col>
                  <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                    <template v-if="editMode">
                      <v-text-field id="email" v-model="organizationInfoEdit.email" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else>
                      {{ organizationInfo?.email }}
                    </template>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Phone (landline):</AppLabel>
                  </v-col>
                  <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                    <template v-if="editMode">
                      <v-text-field id="phoneLandline" v-model="organizationInfoEdit.phoneLandline" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else>
                      {{ organizationInfo?.phoneLandline }}
                    </template>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Phone (cell):</AppLabel>
                  </v-col>
                  <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                    <template v-if="editMode">
                      <v-text-field id="phoneCell" v-model="organizationInfoEdit.phoneCell" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else>
                      {{ organizationInfo?.phoneCell }}
                    </template>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" lg="6">
              <v-card variant="flat">
                <v-row no-gutters>
                  <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Mailing Address:</AppLabel>
                  </v-col>
                  <v-col></v-col>
                  <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                    <v-row no-gutters justify="end">
                      <v-icon v-show="!editMode" icon="fa:fa-regular fa-pen-to-square" @click="toggleEditMode()"></v-icon>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Street Address 1:</AppLabel>
                  </v-col>
                  <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                    <!--template v-if="editMode">
                      <v-text-field id="mailingStreetAddress1" v-model="organizationInfoEdit.mailingStreetAddress1" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                    {{ organizationInfo?.mailingStreetAddress1 }}
                    <!--/template-->
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Street Address 2:</AppLabel>
                  </v-col>
                  <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                    <!--template v-if="editMode">
                      <v-text-field id="mailingStreetAddress2" v-model="organizationInfoEdit.mailingStreetAddress2" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                    {{ organizationInfo?.mailingStreetAddress2 }}
                    <!--/template-->
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="auto" sm="auto" md="auto" lg="auto" class="ma-2">
                    <AppLabel>City:</AppLabel>
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <!--template v-if="editMode">
                      <v-text-field id="mailingCity" v-model="organizationInfoEdit.mailingCity" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                    {{ organizationInfo?.mailingCity }}
                    <!--/template-->
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <AppLabel>Prov:</AppLabel>
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <!--template v-if="editMode">
                      <v-text-field id="mailingProv" v-model="organizationInfoEdit.mailingProvince" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                    {{ organizationInfo?.mailingProvince }}
                    <!--/template-->
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <AppLabel>Postal Code:</AppLabel>
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <!--template v-if="editMode">
                      <v-text-field id="mailingPostalCode" v-model="organizationInfoEdit.mailingPostalCode" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                    {{ organizationInfo?.mailingPostalCode }}
                    <!--/template-->
                  </v-col>
                </v-row>
                <v-row><v-col></v-col></v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="3" class="ma-2">
                    <AppLabel>Physical Address:</AppLabel>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                    <AppLabel>Street Address 1:</AppLabel>
                  </v-col>
                  <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                    <!--template v-if="editMode">
                      <v-text-field id="streetAddress1" v-model="organizationInfoEdit.streetAddress1" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                    {{ organizationInfo?.streetAddress1 }}
                    <!--/template-->
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="3" md="2" lg="3" class="ma-2">
                    <AppLabel>Street Address 2:</AppLabel>
                  </v-col>
                  <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                    <!--template v-if="editMode">
                      <v-text-field id="streetAddress2" v-model="organizationInfoEdit.streetAddress2" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                    {{ organizationInfo?.streetAddress2 }}
                    <!--/template-->
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="auto" class="ma-2">
                    <AppLabel>City:</AppLabel>
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <!--template v-if="editMode">
                      <v-text-field id="city" v-model="organizationInfoEdit.city" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                    {{ organizationInfo?.city }}
                    <!--/template-->
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <AppLabel>Prov:</AppLabel>
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <!--template v-if="editMode">
                      <v-text-field id="province" v-model="organizationInfoEdit.province" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                    {{ organizationInfo?.province }}
                    <!--/template-->
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <AppLabel>Postal Code:</AppLabel>
                  </v-col>
                  <v-col cols="auto" class="ma-2">
                    <!--template v-if="editMode">
                      <v-text-field id="postalCode" v-model="organizationInfoEdit.postalCode" variant="outlined" density="compact" :rules="rules.required" :disabled="loading"></v-text-field>
                    </template>
                    <template v-else-->
                    {{ organizationInfo?.postalCode }}
                    <!--/template-->
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-if="editMode">
            <v-col cols="12" class="d-flex justify-center">
              <AppButton id="cancel-edit" :primary="false" size="large" width="200px" @click="toggleEditMode()" :loading="loading" class="mr-6">Cancel</AppButton>
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
      organizationInfoEdit: undefined,
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
      this.$refs.organizationForm?.validate()
      if (!this.isFormComplete) {
        return
      }
      try {
        this.loading = true
        await OrganizationService.updateOrganization(this.userInfo?.organizationId, this.organizationInfoEdit)
        this.organizationInfo = { ...this.organizationInfoEdit }
        this.editMode = false
        this.setSuccessAlert('Organization information updated successfully')
      } catch (error) {
        this.setFailureAlert('Failed to get your organization information', error)
      } finally {
        this.loading = false
      }
    },

    toggleEditMode() {
      this.organizationInfoEdit = { ...this.organizationInfo }
      this.editMode = !this.editMode
    },

  },
}
</script>
