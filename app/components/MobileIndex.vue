<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
    <!-- Full-bleed featured hero with swipe navigation -->
    <FeaturedPostsHero class="h-[92vh]" />

    <!-- Stepped scroll content -->
    <section class="space-y-10 px-4 pb-16">
      <MobileProjectsGrid />
      <RecentPostsGrid />
    </section>
  </div>
</template>

<script setup lang="ts">
// Components are auto-imported by Nuxt; no script logic needed here.
</script>
