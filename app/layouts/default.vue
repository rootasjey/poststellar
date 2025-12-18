<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950 font-text">
    <header
      class="sticky top-0 z-10 transition-all duration-300"
      :class="[
        isScrolled ? 'shadow-sm' : '',
        (isScrolled && isScrollingDown) ? '-translate-y-full' : 'translate-y-0'
      ]"
      role="banner"
    >
      <AppHeader />
    </header>
    <main class="flex-1 pb-20 md:pb-0">
      <slot />
    </main>
    <AppFooter />
    <MobileBottomNav class="lg:hidden" />
  </div>
</template>

<script setup lang="ts">
import { useHeaderScroll } from '../composables/useHeaderScroll'
const { isScrolled, isScrollingDown } = useHeaderScroll({ threshold: 12 })
</script>
