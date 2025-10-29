<template>
  <section class="py-8 md:py-12 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-6 xl:gap-4">
        <article
          v-for="post in posts"
          :key="post.slug"
          class="group"
        >
          <NuxtLink :to="`/posts/${post.slug}`" class="flex gap-3 md:gap-4 items-start">
            <!-- Image on Left (smaller) -->
            <div class="relative overflow-hidden rounded-xl w-24 h-24 md:w-28 md:h-28 xl:w-24 xl:h-24 flex-shrink-0">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Content on Right -->
            <div class="flex-1 min-w-0">
              <h2 class="text-base md:text-lg xl:text-base font-text font-bold mb-2 group-hover:underline transition-all line-clamp-2 md:line-clamp-2">
                {{ post.title }}
              </h2>
              <div class="flex items-center gap-2 font-600 text-xs text-gray-500 dark:text-gray-400">
                <time>{{ post.date }}</time>
                <span>—</span>
                <span>{{ post.author }}</span>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface PostItem {
  slug: string
  title: string
  image: string
  date: string
  author: string
}

const props = defineProps<{
  posts: PostItem[]
}>()
</script>
