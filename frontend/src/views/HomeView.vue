<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-text-box-outline" title="Reporting" @click="$router.push({ name: 'reporting' })">
          <v-card-text>
            Donec iaculis nec quam vel congue. Fusce consequat mattis rhoncus. Sed id ipsum sed purus placerat euismod vel ut erat. Nullam ligula leo, fermentum vel interdum sit amet, tempor at nunc.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col sm="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-currency-usd" title="Funding" @click="$router.push({ name: 'funding' })">
          <v-card-text>
            Suspendisse tristique fringilla nibh, et vehicula tortor hendrerit a. Etiam nisi erat, dictum finibus arcu feugiat, dictum vestibulum augue. In et auctor urna. Suspendisse potenti.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col sm="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-folder-outline" title="Documents" @click="$router.push({ name: 'documents' })">
          <v-card-text>
            Sed id ipsum sed purus placerat euismod vel ut erat. Nullam ligula leo, fermentum vel interdum sit amet, tempor at nunc. Suspendisse tristique fringilla nibh, et vehicula tortor hendrerit
            a.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col sm="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-file-document-edit-outline" title="Applications" @click="$router.push({ name: 'applications' })">
          <v-card-text>
            Etiam nisi erat, dictum finibus arcu feugiat, dictum vestibulum augue. In et auctor urna. Suspendisse potenti. Duis aliquet non ipsum a feugiat. Mauris felis mi, feugiat eu placerat non,
            tempor a velit.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col sm="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-help" title="Resources" @click="$router.push({ name: 'resources' })">
          <v-card-text>
            Curabitur molestie pulvinar sapien. Aenean aliquet dolor at mollis laoreet. Duis vel placerat lectus, eu rutrum turpis. Morbi consequat, purus et tempus iaculis, sapien massa rhoncus ex,
            sed consectetur leo odio in magna.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col sm="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-cog-outline" title="Settings" @click="$router.push({ name: 'settings' })">
          <v-card-text>
            Nunc viverra est magna, et cursus lacus sagittis vel. Nam enim nibh, sollicitudin non leo vitae, suscipit egestas purus. Ut a est nec ante viverra fringilla in ac leo.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- <div v-if="isAuthenticated && userInfo">
    <v-container>
      <v-card>
        <v-card-title>{{ isMinistryUser && !isImpersonating ? 'Ministry ' : 'Provider ' }}User</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-title>{{ isMinistryUser && !isImpersonating ? 'IDIR' : 'Business BCeID' }}:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.userName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>GUID:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.userId }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="!isMinistryUser && userInfo.businessName">
              <v-list-item-title>Business Legal Name:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.businessName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Name:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.firstName }} {{ userInfo.lastName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Email:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container v-if="!isMinistryUser || isImpersonating">
      <v-card>
        <v-card-title>Roles</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-subtitle>{{ userInfo.roles }} (WIP: will convert #s to descriptions)</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container v-if="!isMinistryUser || isImpersonating">
      <v-card>
        <v-card-title>Organization</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-title>ID:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.organizationId }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Account Number:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.organizationAccountNumber }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Name:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.organizationName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Type:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.organizationAccountType }} (WIP: will convert # to description)</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container v-if="!isMinistryUser || isImpersonating">
      <v-card>
        <v-card-title>Current Facility</v-card-title>
        <v-card-text>
          Facility Name:
          <br />
          <span style="opacity: 0.6">{{ currentFacility?.facilityName }}</span>
        </v-card-text>
      </v-card>
    </v-container>
  </div> -->
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  computed: {
    ...mapState(useAuthStore, ['currentFacility', 'userInfo', 'isAuthenticated', 'isMinistryUser', 'isImpersonating']),
  },
}
</script>

<style>
div.v-card-title {
  padding-bottom: 0px;
}

.home-card {
  border-top: 5px solid #003366 !important;
  min-height: 250px;
}

.smallCardEnabled {
  min-height: 250px;
  border-top: 5px solid #036 !important;
}

.smallCardDisabled {
  min-height: 250px;
  border-top: 5px solid #909090 !important;
}
</style>
