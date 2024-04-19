<template>
  <OrganizationHeader :showFacility="false" />
  <v-container fluid v-bind="$attrs">
    <h1>FA-######</h1>
    <div style="color: #999999">FA GUID: {{ $route.params.fundingGuid }}</div>
    <p>Carefully review your funding agreement.</p>
    <h4>Service Delivery Details</h4>
    <h4>Declaration</h4>
    <div style="background-color: #eeeeee; border: 1px solid #333333; padding: 5px">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra risus et auctor malesuada. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam
      finibus odio lacus, et ultrices orci congue vel. Nam dui ligula, eleifend ac est in, cursus interdum metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi molestie massa et risus
      mattis, vel lobortis ex condimentum. Mauris efficitur eros ac arcu efficitur, at sodales enim commodo. Maecenas non diam lorem. Cras consectetur, odio sit amet blandit euismod, odio turpis
      finibus dui, a facilisis enim mi in est.
    </div>
    <v-checkbox label="I agree" />
    <v-text-field placeholder="Name of authorized person" />
    <AppBackButton id="back-home-button" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
  </v-container>
</template>

<script>
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'

export default {
  name: 'FundingView',
  components: { AppBackButton, OrganizationHeader },
}
</script>

<style scoped></style>
