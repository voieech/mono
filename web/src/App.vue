<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
</script>

<template>
  <header>
    <div class="wrapper">
      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
    </div>
  </header>

  <RouterView />
  <VueQueryDevtools />
</template>
