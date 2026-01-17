<script setup lang="ts">
import FeaturedChannels from "./FeaturedChannels.vue";
import FeaturedEpisodes from "./FeaturedEpisodes.vue";
import HomeHero from "./HomeHero.vue";
import Navbar from "./NavBar.vue";
// import Benefits from "./Benefits.vue";
// import Example from "./Example.vue";
// import How from "./How.vue";
// import Demo from "./Demo.vue";
// import CTA from "./CTA.vue";
// import ContactUsForm from "./ContactUsForm.vue";
import Footer from "../../components/Footer.vue";
</script>

<template>
  <Navbar />
  <HomeHero class="mb-12 lg:mb-20" />
  <FeaturedChannels class="pb-24 lg:pb-40" />
  <FeaturedEpisodes class="pb-24 lg:pb-40" />
  <!-- <Benefits class="pb-24 lg:pb-40" /> -->
  <!-- <Example class="pb-20 md:pb-28" /> -->
  <!-- <How class="pb-16 md:pb-28" /> -->
  <!-- <Demo class="pb-12 md:pb-32" /> -->
  <!-- <CTA class="pb-16 md:pb-32" /> -->
  <!-- <ContactUsForm class="pb-12 md:pb-24" /> -->
  <Footer></Footer>
</template>
