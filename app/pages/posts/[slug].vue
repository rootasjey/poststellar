<template>
  <div class="min-h-screen">
    <!-- Hero Section - Dark Header with Title -->
    <div class="py-16 md:py-24">
      <div class="container mx-auto px-4 md:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Date and Reading Time -->
          <div class="font-600 text-md text-gray-400 flex items-center justify-center gap-3 mb-6">
            <time>{{ new Date(post.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) }}</time>
            <span>—</span>
            <span>{{ post.readingTime }}</span>
          </div>
          
          <!-- Title -->
          <h1 class="max-w-3xl mx-auto text-4xl md:text-5xl lg:text-4xl font-serif font-700 mb-6 leading-tight">
            {{ post.title }}
          </h1>
          
          <!-- Excerpt/Description -->
          <p class="font-body font-600 color-gray-500 text-base md:text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
            {{ post.excerpt }}
          </p>

          <!-- Tags/Badges -->
          <div class="flex items-center justify-center flex-wrap gap-3">
            <div
              class="bg-[#F2F3F4] text-color-black dark:bg-gray-600 dark:text-color-white rounded-full 
                px-4 py-1 text-xs font-semibold flex items-center gap-2"
            >
              <NIcon name="i-ph-lightning-fill" />
              <span>FEATURED POST</span>
            </div>
            <div
              v-for="tag in post.tags"
              :key="tag"
              class="uppercase bg-[#F2F3F4] text-color-black dark:bg-gray-600 dark:text-color-white rounded-full px-4 py-1 text-xs font-semibold flex items-center"
            >
              {{ tag }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Image -->
    <div class="w-full px-4">
      <NuxtImg
        :src="post.featuredImage" 
        :alt="post.title"
        class="w-full h-auto max-h-[90vh] object-cover rounded-2xl"
      />
    </div>

    <!-- Post Info Bar Below Image -->
    <div class="border-b border-border bg-background">
      <div class="container mx-auto px-4 md:px-8">
        <div class="max-w-3xl mx-auto py-6">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <!-- Author Info -->
            <div class="flex items-center gap-3">
              <img 
                :src="post.author.avatar" 
                :alt="post.author.name"
                class="w-8 h-8 rounded-full"
              />
              <div>
                <div class="font-semibold">{{ post.author.name }}</div>
              </div>
            </div>

            <!-- Social Share Buttons -->
            <div class="flex gap-2">
              <NButton
                icon
                size="sm"
                btn="ghost-gray"
                class="hover:bg-muted"
                aria-label="Share on Twitter"
              >
                <div class="i-ph-x-logo w-5 h-5" />
              </NButton>
              <NButton
                icon
                size="sm"
                btn="ghost-gray"
                class="hover:bg-muted"
                aria-label="Share on Facebook"
              >
                <div class="i-ph-facebook-logo w-5 h-5" />
              </NButton>
              <NButton
                icon
                size="sm"
                btn="ghost-gray"
                class="hover:bg-muted"
                aria-label="Share via Email"
              >
                <div class="i-ph-envelope w-5 h-5" />
              </NButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <article class="py-12 md:py-16 bg-background">
      <div class="container mx-auto px-4 md:px-8">
        <div class="max-w-3xl mx-auto">
          <!-- Tiptap Content Renderer -->
          <PostContent :content="post.content" />
        </div>
      </div>
    </article>

    <!-- Author Bio Section -->
    <section class="py-12 md:py-16 dark:bg-gray-950">
      <div class="container mx-auto px-4 md:px-8">
        <div class="max-w-3xl mx-auto border-t pt-8">
          <div class="flex items-center justify-between gap-8 flex-wrap md:flex-nowrap">
            <!-- Left: Avatar and Name -->
            <div class="flex items-center gap-6">
              <img 
                :src="post.author.avatar" 
                :alt="post.author.name"
                class="w-12 h-12 rounded-full flex-shrink-0 ring-4 ring-white/10"
              />
              <div>
                <h3 class="text-md font-bold mb-1">{{ post.author.name }}</h3>
              </div>
            </div>

            <!-- Social Share Buttons -->
            <div class="flex gap-2">
              <NButton
                icon
                size="sm"
                btn="ghost-gray"
                class="hover:bg-muted"
                aria-label="Share on Twitter"
              >
                <div class="i-ph-x-logo w-5 h-5" />
              </NButton>
              <NButton
                icon
                size="sm"
                btn="ghost-gray"
                class="hover:bg-muted"
                aria-label="Share on Facebook"
              >
                <div class="i-ph-facebook-logo w-5 h-5" />
              </NButton>
              <NButton
                icon
                size="sm"
                btn="ghost-gray"
                class="hover:bg-muted"
                aria-label="Share via Email"
              >
                <div class="i-ph-envelope w-5 h-5" />
              </NButton>
              <NButton
                icon
                size="sm"
                btn="ghost-gray"
                class="hover:bg-muted"
                aria-label="Share via Email"
              >
                <div class="i-ph-copy w-5 h-5" />
              </NButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Posts Section -->
    <section class="py-16 bg-muted/30">
      <div class="container mx-auto px-4 md:px-8">
        <h2 class="uppercase font-600 text-size-4 mb-4">You Might Also Like</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <NuxtLink
            v-for="relatedPost in post.relatedPosts"
            :key="relatedPost.slug"
            :to="`/posts/${relatedPost.slug}`"
            class="group"
          >
            <article class="h-full overflow-hidden">
              <div class="aspect-[5/3] overflow-hidden rounded-lg">
                <img 
                  :src="relatedPost.image" 
                  :alt="relatedPost.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div class="pt-3">
                <NLink
                  class="bg-amber-400 font-title text-size-3 font-600 uppercase rounded-full px-3 py-1"
                >
                  {{ relatedPost.tag }}
                </NLink>
                <h3 class="mt-2 font-serif font-700 text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {{ relatedPost.title }}
                </h3>
                <div class="flex items-center gap-2 text-sm font-600 color-gray-500 dark:text-gray-400">
                  <time>{{ new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</time>
                  <span>•</span>
                  <span>{{ relatedPost.author }}</span>
                </div>
              </div>
            </article>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

// Mock post data - will be replaced with API call later
const post = ref({
  title: "Discovering Hidden Corners of Cities Through Local Eyes",
  excerpt: "In 1845, Henry David Thoreau left Concord for Walden Pond with an axe, a notebook, and a singular goal: to 'live deliberately.' Two centuries later, we carry smartphones that ping 72 times a day—each notification a tiny fracture in our attention.",
  // featuredImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80",
  featuredImage: "https://images.unsplash.com/photo-1760696155994-a62ecbb320a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1600",
  author: {
    name: "Lara Bell",
    avatar: "https://i.pravatar.cc/150?img=1",
    bio: "A creative writer exploring the intersection of technology, culture, and human experience."
  },
  publishedAt: "2024-09-11",
  readingTime: "8 min read",
  tags: ["Travel", "Culture", "Urban Exploration"],
  content: `
    <h2>Hook — Opening Scene</h2>
    <p>In 1845, Henry David Thoreau left Concord for Walden Pond with an axe, a notebook, and a singular goal: to 'live deliberately.' Two centuries later, we carry smartphones that ping 72 times a day—each notification a tiny fracture in our attention. What happened to the space between thoughts?</p>
    
    <blockquote>
      <p>Silence isn't just the absence of sound; it's the canvas for deeper cognition. Yet modern life treats it like a glitch to be fixed—with podcasts, playlists, and infinite scroll. This is the cost of that loss.</p>
    </blockquote>

    <h2>Historical Deep Dive</h2>
    <p>Blaise Pascal wrote in 1654: 'All of humanity's problems stem from man's inability to sit quietly in a room alone.' Today, we've outsourced our inner dialogues to algorithms—therapy apps, AI chatbots, and curated 'mindfulness' streams. Is this progress?</p>
    
    <img src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&q=80" alt="Urban landscape" />

    <h2>The Urban Experience</h2>
    <p>Cities pulse with energy, but hidden within their concrete veins are stories waiting to be discovered. Every alleyway whispers secrets of the past, every corner café brews conversations that shape the future. When we explore through local eyes, we don't just see buildings—we experience the soul of a place.</p>
    
    <p>Walking through neighborhoods that tourists rarely visit reveals the authentic heartbeat of urban life. It's in the morning markets where vendors know their customers by name, in the parks where children play the same games their grandparents did, in the small shops that have weathered decades of change while maintaining their unique character.</p>

    <h2>Artistic Case Study</h2>
    <p>When Cage's 'silent' piano piece debuted in 1952, audiences rioted. But his point was radical: silence is full of unintended sound—breaths, rustling clothes, distant traffic. In an age of noise pollution, his work feels prophetic.</p>
    
    <img src="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&q=80" alt="City architecture" />
    
    <p>A 2023 study showed the average person spends 47% of waking hours consuming media. Silence is now a luxury commodity—sold by retreat centers and noise-canceling headphones. What does it mean when stillness must be purchased?</p>

    <h2>Finding Authenticity</h2>
    <p>The best city experiences often come from getting lost. When we abandon our GPS and follow curiosity instead, we stumble upon the authentic moments that guide books miss. A hidden courtyard garden, a street musician's haunting melody, a mural that tells a neighborhood's history—these discoveries become the memories we cherish most.</p>
    
    <p>Local guides—not the professional ones, but the residents who love their city—offer perspectives that transform sightseeing into genuine connection. They know which bakery makes the best bread, which bench offers the perfect sunset view, which streets come alive with music on Saturday nights.</p>
  `,
  relatedPosts: [
    {
      title: "Beyond Borders: The Joy and Adventure of Travel",
      slug: "beyond-borders",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
      tag: "Travel",
      date: "2024-09-10",
      author: "Lara Bell"
    },
    {
      title: "From Pools to Oceans: Exploring the World of Swimming",
      slug: "pools-to-oceans",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
      tag: "Nature",
      date: "2024-09-10",
      author: "Lara Bell"
    },
    {
      title: "The Majestic World of Horses: Companions Through History",
      slug: "majestic-horses",
      image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",
      tag: "Nature",
      date: "2024-09-10",
      author: "Lara Bell"
    },
    {
      title: "Journeys That Inspire: Travel Tips and Experiences",
      slug: "journeys-inspire",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
      tag: "Travel",
      date: "2024-09-09",
      author: "Lara Bell"
    }
  ]
});

useHead({
  title: post.value.title,
  meta: [
    { name: 'description', content: post.value.excerpt },
    { property: 'og:title', content: post.value.title },
    { property: 'og:description', content: post.value.excerpt },
    { property: 'og:image', content: post.value.featuredImage },
  ]
});
</script>

<style scoped>
.social-btn {
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
}
</style>
