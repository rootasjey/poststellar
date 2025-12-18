<template>
  <div class="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100">
    <div class="max-w-3xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">Settings</h1>
        <p class="text-sm text-gray-500">v{{ appVersion }}</p>
      </div>

      <div class="space-y-3">
        <!-- Theme -->
        <div class="p-4 rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/60 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="i-ph-moon-duotone w-5 h-5 text-yellow-500"></div>
            <div>
              <div class="font-medium">Theme</div>
              <div class="text-sm text-gray-500">Light · Dark · System</div>
            </div>
          </div>
          <NThemeSwitcher />
        </div>

        <!-- Profile -->
        <NuxtLink to="/profile" class="p-4 rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/60 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="i-ph-user-circle-duotone w-5 h-5 text-gray-700 dark:text-gray-300"></div>
            <div>
              <div class="font-medium">Profile</div>
              <div class="text-sm text-gray-500">Manage account and profile details</div>
            </div>
          </div>
          <div class="i-ph-caret-right text-gray-400" />
        </NuxtLink>

        <!-- About -->
        <NuxtLink to="/about" class="p-4 rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/60 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="i-ph-newspaper-duotone w-5 h-5 text-gray-700 dark:text-gray-300"></div>
            <div>
              <div class="font-medium">About</div>
              <div class="text-sm text-gray-500">App & project information</div>
            </div>
          </div>
          <div class="i-ph-caret-right text-gray-400" />
        </NuxtLink>

        <!-- Credits -->
        <NuxtLink to="/credits" class="p-4 rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/60 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="i-ph-github-logo-duotone w-5 h-5 text-gray-700 dark:text-gray-300"></div>
            <div>
              <div class="font-medium">Credits</div>
              <div class="text-sm text-gray-500">Open-source, contributors & acknowledgements</div>
            </div>
          </div>
          <div class="i-ph-caret-right text-gray-400" />
        </NuxtLink>

        <!-- App version -->
        <div class="p-4 rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/60 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="i-ph-info-duotone w-5 h-5 text-gray-700 dark:text-gray-300"></div>
            <div>
              <div class="font-medium">App version</div>
              <div class="text-sm text-gray-500">Currently running v{{ appVersion }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Settings — Corpinot' })

const config = useRuntimeConfig()
const appVersion = (config.public?.appVersion as string) || '0.0.0'
</script>
