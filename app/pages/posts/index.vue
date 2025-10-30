<template>
  <div class="min-h-screen py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-8">
      <!-- Page Header -->
      <div class="text-center mb-12 md:mb-16">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Latest Posts
        </h1>
        <p class="text-lg md:text-xl text-muted max-w-2xl mx-auto">
          Explore stories, ideas, and insights from our writers
        </p>
      </div>

      <!-- Posts Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <NuxtLink
          v-for="post in posts"
          :key="post.slug"
          :to="`/posts/${post.slug}`"
          class="group"
        >
          <article class="h-full flex flex-col bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <!-- Image -->
            <div class="aspect-[16/10] overflow-hidden">
              <img 
                :src="post.image" 
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            
            <!-- Content -->
            <div class="flex-1 flex flex-col p-6">
              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-3">
                <NButton
                  v-for="tag in post.tags"
                  :key="tag"
                  size="xs"
                  variant="soft"
                >
                  {{ tag }}
                </NButton>
              </div>

              <!-- Title -->
              <h2 class="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {{ post.title }}
              </h2>

              <!-- Excerpt -->
              <p class="text-muted mb-4 line-clamp-2 flex-1">
                {{ post.excerpt }}
              </p>

              <!-- Meta -->
              <div class="flex items-center justify-between pt-4 border-t border-border">
                <div class="flex items-center gap-3">
                  <img 
                    :src="post.author.avatar" 
                    :alt="post.author.name"
                    class="w-8 h-8 rounded-full"
                  />
                  <span class="text-sm font-medium">{{ post.author.name }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-muted">
                  <time>{{ new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</time>
                  <span>•</span>
                  <span>{{ post.readingTime }}</span>
                </div>
              </div>
            </div>
          </article>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Mock posts data - will be replaced with API call later
const posts = ref([
  {
    title: "Discovering Hidden Corners of Cities Through Local Eyes",
    slug: "discovering-hidden-corners",
    excerpt: "In 1845, Henry David Thoreau left Concord for Walden Pond with an axe, a notebook, and a singular goal: to 'live deliberately.'",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
    author: {
      name: "Lara Bell",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    publishedAt: "2024-09-11",
    readingTime: "8 min read",
    tags: ["Travel", "Culture"]
  },
  {
    title: "Beyond Borders: The Joy and Adventure of Travel",
    slug: "beyond-borders",
    excerpt: "Travel opens our minds to new perspectives, cultures, and experiences that shape who we become.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
    author: {
      name: "Lara Bell",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    publishedAt: "2024-09-10",
    readingTime: "6 min read",
    tags: ["Travel", "Adventure"]
  },
  {
    title: "The Art of Slow Living in a Fast-Paced World",
    slug: "slow-living",
    excerpt: "Discover how embracing a slower pace can lead to greater fulfillment and mindfulness in our daily lives.",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
    author: {
      name: "Lara Bell",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    publishedAt: "2024-09-08",
    readingTime: "5 min read",
    tags: ["Lifestyle", "Wellness"]
  }
]);

useHead({
  title: 'Posts - Woords',
  meta: [
    { name: 'description', content: 'Explore our latest articles on travel, culture, and lifestyle.' }
  ]
});
</script>
