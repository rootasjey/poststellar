<template>
  <footer class="bg-[#F8F9FA] text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-t border-gray-200 dark:border-gray-800 py-10">
    <div class="container mx-auto px-4">
      <!-- Brand -->
      <div class="flex items-center justify-center">
        <NuxtLink to="/" class="inline-flex items-baseline gap-1 select-none">
          <span class="text-3xl md:text-4xl font-title font-bold leading-none">Woords</span>
          <sup class="text-xs align-super opacity-70">®</sup>
        </NuxtLink>
      </div>

      <!-- Navigation Links -->
      <nav class="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs md:text-sm font-semibold uppercase tracking-wide">
        <NuxtLink to="/signup" class="hover:text-black dark:hover:text-white transition-colors">Sign up</NuxtLink>
        <NuxtLink to="/signin" class="hover:text-black dark:hover:text-white transition-colors">Sign in</NuxtLink>
        <NuxtLink to="/#recommendations" class="hover:text-black dark:hover:text-white transition-colors">Recommendations</NuxtLink>
        <NuxtLink to="/about" class="hover:text-black dark:hover:text-white transition-colors">About</NuxtLink>
      </nav>

      <!-- Divider -->
      <div class="mt-8 md:mt-10 border-t border-gray-200 dark:border-gray-800"></div>

      <!-- Copyright -->
      <div class="text-center text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-6">
        © {{ currentYear }}
        <NuxtLink to="/" class="hover:text-black dark:hover:text-white transition-colors">Woords</NuxtLink>.
        Published with
        <a href="https://ghost.org/" target="_blank" rel="noopener" class="hover:text-black dark:hover:text-white transition-colors">Ghost</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

function scrollTop() {
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>
