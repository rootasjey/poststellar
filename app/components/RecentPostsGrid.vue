<template>
  <section class="py-12 md:py-16 bg-white dark:bg-gray-950">
    <div class="container mx-auto px-4 max-w-7xl">
      <h2 class="text-xs md:text-sm font-semibold tracking-wider mb-2 uppercase text-gray-900 dark:text-gray-100">
        Recent Posts
      </h2>

      <!-- Grid layout for posts -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-y-12">
        <article
          v-for="post in recentPosts"
          :key="post.slug"
          class="group flex flex-col"
        >
          <NuxtLink :to="`/posts/${post.slug}`" class="block flex flex-col h-full">
            <!-- Image -->
            <div class="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <!-- Featured badge overlay -->
              <div v-if="post.featured" class="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-gray-800 rounded-full text-xs font-semibold shadow-sm">
                <svg class="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>Featured post</span>
              </div>
            </div>

            <!-- Content -->
            <div class="space-y-3 flex-1 flex flex-col">
              <!-- Category badge -->
              <span class="inline-block w-fit px-3 py-1.5 text-xs font-semibold tracking-wide bg-lime-300 dark:bg-lime-400 text-gray-900 rounded-full uppercase">
                {{ post.category }}
              </span>
              
              <!-- Title -->
              <h3 class="text-lg md:text-xl font-serif font-bold leading-snug group-hover:opacity-80 transition-opacity line-clamp-2 flex-1">
                {{ post.title }}
              </h3>
              
              <!-- Metadata -->
              <div class="flex items-center gap-2 font-600 text-xs text-gray-500 dark:text-gray-400 mt-auto">
                <time>{{ post.date }}</time>
                <span>—</span>
                <span>{{ post.author }}</span>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>

      <!-- Load more button -->
      <div class="flex justify-center mt-12 md:mt-16">
        <button 
          @click="loadMore"
          class="px-8 py-3 text-sm font-semibold tracking-wide bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors uppercase"
        >
          Load More
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface RecentPost {
  slug: string
  title: string
  image: string
  category: string
  date: string
  author: string
  featured?: boolean
}

// Mock data (replace with real data from your API/database)
const recentPosts = ref<RecentPost[]>([
  {
    slug: 'street-stories-people-and-places',
    title: 'Street Stories: The People and Places of Urban Landscapes',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop',
    category: 'Street Photography',
    date: '11 Sep 2025',
    author: 'Bradley Pena',
  },
  {
    slug: 'generations-of-love',
    title: 'Generations of Love: The Everlasting Impact of Family',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop',
    category: 'Family',
    date: '11 Sep 2025',
    author: 'Lara Bell',
  },
  {
    slug: 'capturing-candid-moments',
    title: 'Capturing Candid Moments: A Guide to Street Photography',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    category: 'Street Photography',
    date: '11 Sep 2025',
    author: 'Bradley Pena',
  },
  {
    slug: 'designing-the-future',
    title: 'Designing the Future: Innovation in Modern Architecture',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop',
    category: 'Architecture & Interiors',
    date: '11 Sep 2025',
    author: 'Bradley Pena',
  },
  {
    slug: 'modern-architecture-meets-nature',
    title: 'Modern Architecture Meets Nature: Inspiring Interior Designs',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    category: 'Architecture & Interiors',
    date: '11 Sep 2025',
    author: 'Bradley Pena',
    featured: true,
  },
  {
    slug: 'mindful-minutes',
    title: 'Mindful Minutes: A Guide to Cultivating Inner Peace',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
    category: 'Podcast',
    date: '11 Sep 2025',
    author: 'Bradley Pena',
  },
  {
    slug: 'art-of-observation',
    title: "The Art of Observation: A Street Photographer's Perspective",
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    category: 'Street Photography',
    date: '11 Sep 2025',
    author: 'Bradley Pena',
  },
  {
    slug: 'capturing-changing-seasons',
    title: "Capturing the Changing Seasons: A Photographer's Guide",
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    category: 'Nature',
    date: '11 Sep 2025',
    author: 'Alfie Palmer',
  },
  {
    slug: 'future-is-now',
    title: 'The Future Is Now: Tech Innovations Changing Our World',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    category: 'Podcast',
    date: '11 Sep 2025',
    author: 'Bradley Pena',
  },
])

const loadMore = () => {
  // TODO: Implement actual load more functionality
  // This would typically fetch more posts from your API/database
  console.log('Load more posts...')
}
</script>
