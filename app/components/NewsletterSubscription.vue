<template>
  <!-- Newsletter Subscription -->
  <section class="py-12 md:py-16 bg-white dark:bg-gray-950">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-6 md:mb-8 max-w-3xl mx-auto leading-tight">
        Dive into top stories, trends, and gems you'll love. Subscribe!
      </h1>
      <form class="max-w-lg mx-auto" @submit.prevent="handleSubscribe">
        <div class="flex flex-col sm:flex-row gap-3 items-stretch">
          <div class="flex-1 relative">
            <input
              v-model="email"
              type="email"
              placeholder="Email address"
              class="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border-0 rounded-full 
                font-600 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            <!-- <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">subscribe</span> -->
          </div>
          <button
            type="submit"
            class="sm:w-auto px-6 bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 
              rounded-full uppercase font-medium text-size-3 font-600 transition-colors text-black"
          >
          <span>subscribe</span>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')

function handleSubscribe() {
  console.log('Subscribe:', email.value)
  // TODO: Implement subscription logic
  email.value = ''
}
</script>
