<template>
  <div>
    <section class="py-12 md:py-16 bg-white dark:bg-gray-950">
      <div class="container mx-auto px-6 max-w-7xl">
        <h1 class="text-3xl md:text-4xl font-serif font-800 mb-2">Tags</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-8">Browse all tags and discover posts grouped by topic.</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Tags column -->
          <aside class="md:col-span-1">
            <div class="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 sticky top-6">
              <div class="flex items-center gap-3 mb-4">
                <input
                  v-model="search"
                  type="search"
                  placeholder="Search tags"
                  class="w-full px-4 py-2 rounded-xl bg-white/70 dark:bg-gray-800/60 placeholder-gray-400 outline-none"
                />
              </div>

              <div class="mb-4">
                <button
                  @click="selectTag(null)"
                  :class="['px-3 py-2 rounded-full text-sm font-semibold mr-2 mb-2', selectedTag === null ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100']"
                >
                  All
                </button>
              </div>

              <ul class="space-y-3 max-h-[60vh] overflow-y-auto">
                <li
                  v-for="tag in filteredTags"
                  :key="tag.slug"
                >
                  <button
                    @click="selectTag(tag.slug)"
                    class="w-full flex items-center justify-between gap-4 p-3 rounded-xl hover:shadow-sm transition-all text-left"
                    :aria-pressed="selectedTag === tag.slug"
                  >
                    <div class="flex items-center gap-3">
                      <span :style="{ backgroundColor: tag.color }" class="w-9 h-9 rounded-lg inline-block flex-none"></span>
                      <div>
                        <div class="text-sm font-semibold">{{ tag.name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ tag.description }}</div>
                      </div>
                    </div>

                    <div class="text-xs text-gray-600 dark:text-gray-300 font-semibold">{{ tag.count }}</div>
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          <!-- Posts column -->
          <main class="md:col-span-2">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-8">
              <article v-for="post in visiblePosts" :key="post.slug" class="group flex flex-col">
                <NuxtLink :to="`/posts/${post.slug}`" class="block flex flex-col h-full">
                  <div class="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
                    <img :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>

                  <div class="space-y-2 flex-1 flex flex-col">
                    <span class="inline-block w-fit px-3 py-1.5 text-xs font-semibold tracking-wide bg-lime-300 dark:bg-lime-400 text-gray-900 rounded-full uppercase">{{ post.category }}</span>
                    <h3 class="text-lg md:text-xl font-serif font-bold leading-snug group-hover:opacity-80 transition-opacity line-clamp-2 flex-1">{{ post.title }}</h3>
                    <div class="flex items-center gap-2 font-600 text-xs text-gray-500 dark:text-gray-400 mt-auto">
                      <time>{{ post.date }}</time>
                      <span>—</span>
                      <span>{{ post.author }}</span>
                    </div>
                  </div>
                </NuxtLink>
              </article>
            </div>

            <div v-if="visiblePosts.length === 0" class="mt-12 text-center text-gray-600 dark:text-gray-400">
              No posts found for this tag.
            </div>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Tag {
  slug: string
  name: string
  description?: string
  color?: string
  count?: number
}

interface Post {
  slug: string
  title: string
  image: string
  category: string
  date: string
  author: string
  tags: string[]
}

// Mock tags (replace with API data)
const tags = ref<Tag[]>([
  { slug: 'street-photography', name: 'Street Photography', description: 'Urban life, candid moments', color: '#FFB3BA', count: 12 },
  { slug: 'travel', name: 'Travel', description: 'Guides and journeys', color: '#BAE1FF', count: 9 },
  { slug: 'architecture-interiors', name: 'Architecture & Interiors', description: 'Design and space', color: '#FFFFBA', count: 7 },
  { slug: 'family', name: 'Family', description: 'Family stories and portraits', color: '#E0BBE4', count: 3 },
  { slug: 'nature', name: 'Nature', description: 'Landscapes and wildlife', color: '#C7CEEA', count: 5 },
  { slug: 'podcast', name: 'Podcast', description: 'Audio episodes and notes', color: '#FFD5CD', count: 4 },
])

// Mock posts (replace with API data)
const posts = ref<Post[]>([
  { slug: 'street-stories-people-and-places', title: 'Street Stories: The People and Places of Urban Landscapes', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop', category: 'Street Photography', date: '11 Sep 2025', author: 'Bradley Pena', tags: ['street-photography'] },
  { slug: 'generations-of-love', title: 'Generations of Love: The Everlasting Impact of Family', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop', category: 'Family', date: '11 Sep 2025', author: 'Lara Bell', tags: ['family'] },
  { slug: 'capturing-candid-moments', title: 'Capturing Candid Moments: A Guide to Street Photography', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop', category: 'Street Photography', date: '11 Sep 2025', author: 'Bradley Pena', tags: ['street-photography'] },
  { slug: 'designing-the-future', title: 'Designing the Future: Innovation in Modern Architecture', image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop', category: 'Architecture & Interiors', date: '11 Sep 2025', author: 'Bradley Pena', tags: ['architecture-interiors'] },
  { slug: 'modern-architecture-meets-nature', title: 'Modern Architecture Meets Nature: Inspiring Interior Designs', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', category: 'Architecture & Interiors', date: '11 Sep 2025', author: 'Bradley Pena', tags: ['architecture-interiors','nature'] },
  { slug: 'mindful-minutes', title: 'Mindful Minutes: A Guide to Cultivating Inner Peace', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop', category: 'Podcast', date: '11 Sep 2025', author: 'Bradley Pena', tags: ['podcast'] },
  { slug: 'art-of-observation', title: "The Art of Observation: A Street Photographer's Perspective", image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop', category: 'Street Photography', date: '11 Sep 2025', author: 'Bradley Pena', tags: ['street-photography'] },
  { slug: 'capturing-changing-seasons', title: "Capturing the Changing Seasons: A Photographer's Guide", image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', category: 'Nature', date: '11 Sep 2025', author: 'Alfie Palmer', tags: ['nature'] },
])

const search = ref('')
const selectedTag = ref<string | null>(null)

const filteredTags = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return tags.value
  return tags.value.filter(t => t.name.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q))
})

const visiblePosts = computed(() => {
  if (!selectedTag.value) return posts.value
  return posts.value.filter(p => p.tags.includes(selectedTag.value as string))
})

function selectTag(slug: string | null) {
  selectedTag.value = slug
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* small scrollbar hide for aesthetics */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
