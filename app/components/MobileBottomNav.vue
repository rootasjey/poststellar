<template>
  <nav class="fixed bottom-2 left-4 right-4 rounded-full z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-t border-gray-200 dark:border-gray-800 shadow-[0_-6px_24px_-18px_rgba(0,0,0,0.25)]">
    <div class="mx-auto max-w-3xl px-4 py-2 pb-[calc(env(safe-area-inset-bottom)+6px)]">
      <div class="grid grid-cols-3">
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center justify-center gap-1 py-3 text-xs font-semibold uppercase tracking-wide transition-colors"
          :class="isActive(item.to) ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <span :class="[item.icon, 'text-lg']" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

const items = [
  { label: 'Home', to: '/', icon: 'i-ph-house-simple-duotone' },
  { label: 'Search', to: '/search', icon: 'i-ph-magnifying-glass-duotone' },
  { label: 'Settings', to: '/settings', icon: 'i-ph-gear-six-duotone' },
]

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>
