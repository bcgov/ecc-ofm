<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col xs="8" sm="7" md="5" lg="4" xl="3">
        <v-card class="basic-card">
          <v-card-title>
            <h4>System Error</h4>
          </v-card-title>
          <v-card-text>
            <p>
              You have encountered a System Error.
              <br />
              Close your Web browser, open a new session, then try again.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ErrorView',
}
</script>
