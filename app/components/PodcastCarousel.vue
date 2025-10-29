<template>
  <!-- Podcast Carousel -->
  <section class="relative py-12 md:py-16 bg-gray-900 dark:bg-black text-white grid-pattern">
    <div class="container mx-auto px-8 md:px-12 lg:px-16">
      <!-- Title centered, controls on the right -->
      <div class="relative mb-6 md:mb-8">
        <h2 class="font-serif font-700 text-center mx-auto max-w-2xl text-2xl md:text-4xl">
          Listen and learn with our most amazing podcast
        </h2>
        <div class="absolute right-0 top-1/2 -translate-y-1/2 flex">
          <button
            @click="scrollPodcasts('left')"
            class="p-2 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Previous"
          >
            <div class="i-ph-arrow-left-bold"></div>
          </button>
          <button
            @click="scrollPodcasts('right')"
            class="p-2 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Next"
          >
            <div class="i-ph-arrow-right-bold"></div>
          </button>
        </div>
      </div>

      <div
        ref="podcastsContainer"
        class="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style="scrollbar-width: none; -ms-overflow-style: none"
      >
        <article
          v-for="podcast in podcasts"
          :key="podcast.slug"
          class="flex-shrink-0 w-72 md:w-80 lg:w-[22rem] group"
        >
          <NuxtLink :to="`/posts/${podcast.slug}`" class="block">
            <!-- Taller image with overlayed text -->
            <div class="relative overflow-hidden rounded-xl aspect-[4/5]">
              <img
                :src="podcast.image"
                :alt="podcast.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <!-- Gradient overlay for readability -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <!-- Labels and title -->
              <div class="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                <span class="inline-flex w-fit px-3 py-1.5 text-[11px] tracking-wide uppercase font-semibold bg-white/10 border border-white/15 rounded-full mb-3">
                  Podcast
                </span>
                <h3 class="text-white text-lg md:text-xl font-serif font-700 leading-snug line-clamp-3">
                  {{ podcast.title }}
                </h3>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Podcast {
  slug: string
  title: string
  image: string
}

const podcastsContainer = ref<HTMLElement>()

function scrollPodcasts(direction: 'left' | 'right') {
  if (!podcastsContainer.value) return
  const scrollAmount = 400
  const scrollDirection = direction === 'left' ? -scrollAmount : scrollAmount
  podcastsContainer.value.scrollBy({ left: scrollDirection, behavior: 'smooth' })
}

// Mock data (replace with real data from your API/database)
const podcasts: Podcast[] = [
  {
    slug: 'exploring-creativity',
    title: 'Exploring Creativity: Conversations With Inspiring Voices',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=600&fit=crop',
  },
  {
    slug: 'conversations-with-creatives',
    title: 'Conversations with Creatives: Insights from Top Artists',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop',
  },
  {
    slug: 'why-podcasts-are-changing',
    title: 'Why Podcasts Are Changing the Way We Learn and Connect',
    image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&h=600&fit=crop',
  },
  {
    slug: 'mindful-minutes',
    title: 'Mindful Minutes: A Guide to Cultivating Inner Peace',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop',
  },
  {
    slug: 'the-future-is-now',
    title: 'The Future Is Now: Tech Innovations Changing Our World',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
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

/* Subtle grid background, inspired by the reference */
.grid-pattern {
  position: relative;
}

.grid-pattern::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 56px 56px, 56px 56px;
  background-position: -1px -1px;
  mask-image: radial-gradient(ellipse at center, black, transparent 85%);
}
</style>
