<template>
  <!-- Featured Posts Grid -->
  <section class="py-12 bg-white dark:bg-gray-950">
    <div class="container mx-auto px-4 max-w-7xl">
      <h2 class="text-xs md:text-sm font-semibold tracking-wider mb-3 uppercase text-gray-900 dark:text-gray-100">
        Featured Posts
      </h2>

      <!-- First row: single large article with image left, text right -->
      <article v-if="featuredPosts[0]" class="group mb-10 md:mb-12">
        <NuxtLink :to="`/posts/${featuredPosts[0].slug}`" class="block">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <!-- Image left -->
            <div class="md:col-span-6">
              <div class="relative overflow-hidden rounded-2xl aspect-[4/3]">
                <img
                  :src="featuredPosts[0].image"
                  :alt="featuredPosts[0].title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            <!-- Text right -->
            <div class="md:col-span-6 space-y-4">
              <span class="inline-block px-3.5 py-1.5 text-xs font-semibold tracking-wide bg-lime-300 dark:bg-lime-400 text-gray-900 rounded-full uppercase">
                {{ featuredPosts[0].category }}
              </span>
              <h3 class="text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-tight group-hover:opacity-80 transition-opacity">
                {{ featuredPosts[0].title }}
              </h3>
              <div class="flex items-center gap-2 text-sm font-600 text-gray-500 dark:text-gray-400">
                <time>{{ featuredPosts[0].date }}</time>
                <span>—</span>
                <span>{{ featuredPosts[0].author }}</span>
              </div>
              <p v-if="featuredPosts[0].excerpt" class="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ featuredPosts[0].excerpt }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </article>

      <!-- Below: remaining articles in a responsive grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <article
          v-for="post in featuredPosts.slice(1, 5)"
          :key="post.slug"
          class="group flex flex-col"
        >
          <NuxtLink :to="`/posts/${post.slug}`" class="block flex flex-col h-full">
            <div class="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <!-- Badge overlay for certain posts -->
              <div v-if="post.badge" class="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>{{ post.badge }}</span>
              </div>
            </div>
            <div class="space-y-3 flex-1 flex flex-col">
              <span class="inline-block w-fit px-3 py-1.5 text-xs font-semibold tracking-wide bg-lime-300 dark:bg-lime-400 text-gray-900 rounded-full uppercase">
                {{ post.category }}
              </span>
              <h3 class="text-lg md:text-xl font-serif font-bold leading-snug group-hover:opacity-80 transition-opacity line-clamp-2 flex-1">
                {{ post.title }}
              </h3>
              <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-auto">
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
interface FeaturedPost {
  slug: string
  title: string
  image: string
  category: string
  date: string
  author: string
  excerpt?: string
  badge?: string
}

// Mock data (replace with real data from your API/database)
const featuredPosts: FeaturedPost[] = [
  {
    slug: 'modern-architecture-meets-nature',
    title: 'Modern Architecture Meets Nature: Inspiring Interior Designs',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
    category: 'Architecture & Interiors',
    date: '11 Sep 2025',
    author: 'Bradley Pena',
    excerpt: 'A creative journal that blends the beauty of nature, the spirit of travel, the energy of street life, and the artistry of architecture. This blog is a space to explore inspiring landscapes, hidden corners of the world, everyday urban moments, and timeless design.',
  },
  {
    slug: 'small-spaces-big-style',
    title: "Small Spaces, Big Style: Maximizing Your Apartment's Potential",
    image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop',
    category: 'Architecture & Interiors',
    date: '11 Sep 2025',
    author: 'Bradley Pena',
  },
  {
    slug: 'discovering-hidden-corners-cities',
    title: 'Discovering Hidden Corners of Cities Through Local Eyes',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
    category: 'Travel',
    date: '11 Sep 2025',
    author: 'Lara Bell',
  },
  {
    slug: 'from-pools-to-oceans',
    title: 'From Pools to Oceans: Exploring the World of Swimming',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop',
    category: 'Nature',
    date: '10 Sep 2025',
    author: 'Lara Bell',
    badge: 'Members',
  },
  {
    slug: 'many-faces-of-motherhood',
    title: 'The Many Faces of Motherhood: A Journey of Love and Growth',
    image: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&h=600&fit=crop',
    category: 'Family',
    date: '10 Sep 2025',
    author: 'Alfie Palmer',
    badge: 'Members',
  },
]
</script>
