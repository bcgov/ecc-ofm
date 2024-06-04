<template>
  <v-row align="center" justify="center">
    <v-col xs="8" sm="7" md="5" lg="4" xl="3">
      <v-card class="basic-card">
        <v-card-title>
          <h4><slot name="title" /></h4>
        </v-card-title>
        <v-card-text>
          <slot name="text" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
