<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row>
      <v-col class="hero-image pa-0" />
    </v-row>
    <v-row>
      <v-col class="hero-text px-2 py-0 mb-2">$10 a Day ChildCareBC Centres</v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.hero-text {
  background-color: rgb(56, 89, 138, 1);
  color: #ffffff;
  font-weight: 500;
  font-size: 1.6rem;
  text-align: center;
}

.hero-image {
  background-image: url('@/assets/images/hero-xl.jpg');
  background-size: cover;
  background-position: center;
  height: 250px;
  width: 100%;
}

@media only screen and (max-width: 1279px) {
  .hero-image {
    background-image: url('@/assets/images/hero-md.jpg');
    height: 200px;
  }
}

@media only screen and (max-width: 959px) {
  .hero-image {
    background-image: url('@/assets/images/hero-sm.jpg');
    height: 150px;
  }
}
</style>
