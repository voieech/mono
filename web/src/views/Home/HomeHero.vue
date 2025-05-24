<script setup lang="ts">
import { appLink } from "../../utils/links.ts";
</script>

<template>
  <div
    class="to-primary flex h-[calc(100dvh-4rem)] w-full flex-col justify-center bg-gradient-to-tr from-zinc-100 from-50% to-100% px-8"
  >
    <div class="flex flex-col items-center gap-8 lg:gap-12">
      <p
        class="font-sans text-5xl text-zinc-900 sm:text-center sm:text-6xl lg:text-7xl xl:text-8xl"
      >
        <span class="font-extrabold opacity-85">We make Podcasts</span>

        <span class="block py-2"></span>

        <span
          class="from-primary inline-block cursor-default bg-gradient-to-br to-zinc-800 bg-clip-text font-semibold text-transparent opacity-80 hover:underline hover:decoration-black hover:decoration-4 hover:underline-offset-8"
          >Just, For, You.</span
        >
      </p>

      <p
        class="max-w-sm leading-snug font-thin text-zinc-800 sm:max-w-md sm:text-center sm:text-lg xl:max-w-2xl xl:text-xl"
      >
        voieech uses latest news and your preferences to generate personalised
        podcasts just for you, so you can listen your way.
      </p>

      <div class="pt-4">
        <a
          :href="appLink"
          target="_blank"
          class="bg-primary cursor-pointer rounded-full px-20 py-2.5 text-xl font-light text-zinc-500 hover:shadow-2xl lg:py-3 lg:text-2xl"
        >
          START
        </a>

        <!-- @todo -->
        <!-- <p class="pt-6 text-center text-sm font-extralight text-zinc-700">
          Get started in 1 minute with no <br />
          technical knowledge required.
        </p> -->
      </div>
    </div>
  </div>
</template>
