<template>
  <v-container fluid class="ma-0 pa-0">
    <div class="hero-image" />
    <div class="hero-text">$10 a Day ChildCareBC Centres</div>
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
