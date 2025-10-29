<template>
  <!-- Trending Tags Carousel -->
  <section class="bg-white dark:bg-gray-950">
    <div class="container mx-auto px-10">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-sm md:text-sm font-text font-600 uppercase">Trending tags</h2>
        <div class="flex">
          <button
            @click="scrollTags('left')"
            class="p-2.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="i-ph-arrow-left-bold"></div>
          </button>
          <button
            @click="scrollTags('right')"
            class="p-2.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="i-ph-arrow-right-bold"></div>
          </button>
        </div>
      </div>

      <div
        ref="tagsContainer"
        class="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style="scrollbar-width: none; -ms-overflow-style: none"
      >
        <div
          v-for="tag in trendingTags"
          :key="tag.slug"
          class="flex-shrink-0 w-72 md:w-80"
        >
          <NuxtLink
            :to="`/tags/${tag.slug}`"
            class="flex flex-col h-full p-5 md:p-6 rounded-2xl transition-all hover:shadow-md"
            :style="{ backgroundColor: tag.color }"
          >
            <div class="space-y-2.5 md:space-y-3 flex-1">
              <h3 class="text-lg md:text-xl font-serif font-800 text-black">{{ tag.name }}</h3>
              <p class="text-xs md:text-sm leading-relaxed text-black/80 font-500 line-clamp-3">{{ tag.description }}</p>
            </div>
            <div class="mt-3 md:mt-4">
              <span class="inline-block px-4 py-2 bg-white rounded-full text-xs font-600 text-black uppercase">
                View Posts
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface TrendingTag {
  slug: string
  name: string
  description: string
  color: string
}

const tagsContainer = ref<HTMLElement>()

function scrollTags(direction: 'left' | 'right') {
  if (!tagsContainer.value) return
  const scrollAmount = 400
  const scrollDirection = direction === 'left' ? -scrollAmount : scrollAmount
  tagsContainer.value.scrollBy({ left: scrollDirection, behavior: 'smooth' })
}

// Mock data (replace with real data from your API/database)
const trendingTags: TrendingTag[] = [
  {
    slug: 'street-photography',
    name: 'Street Photography',
    description: 'From quiet passages in charming towns to the hustle and bustle of cities, this category examines street photography in every form.',
    color: '#FFB3BA',
  },
  {
    slug: 'travel',
    name: 'Travel',
    description: 'Explore the globe through captivating landscapes and vibrant cultures in this Travel category, celebrating diverse destinations worldwide.',
    color: '#BAE1FF',
  },
  {
    slug: 'architecture-interiors',
    name: 'Architecture & Interiors',
    description: 'Celebrating the artistry of spaces, this category highlights stunning photography of architecture and interiors.',
    color: '#FFFFBA',
  },
  {
    slug: 'family',
    name: 'Family',
    description: 'Celebrating the love, support, and connections that make family the foundation of happiness, growth, and lasting memories.',
    color: '#E0BBE4',
  },
  {
    slug: 'nature',
    name: 'Nature',
    description: 'This category showcases the beauty of nature and wildlife, from vast landscapes to macro details, transporting viewers into the outdoors.',
    color: '#C7CEEA',
  },
  {
    slug: 'podcast',
    name: 'Podcast',
    description: 'A podcast is an episodic series of digital audio or video files available on the internet for users to download or stream at their convenience.',
    color: '#FFD5CD',
  },
]
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
