<template>
  <div>
    <HeroFeaturedPosts :posts="heroFeaturedPosts" />
    <NewsletterSubscription />
    <TrendingTagsCarousel />
    <FeaturedPostsGrid />
    <PodcastCarousel />
    <RecentPostsGrid />
  </div>
</template>

<script setup lang="ts">
// Mock data (replace with real data from your API/database)
const heroFeaturedPosts = [
  {
    slug: 'finding-peace-in-the-wild',
    title: 'Finding Peace in the Wild: A Journey Through National Parks',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop',
    date: '11 Sep 2025',
    author: 'Alfie Palmer',
  },
  {
    slug: 'living-spaces',
    title: 'Living Spaces: How Architecture Transforms Daily Life',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=1000&fit=crop',
    date: '11 Sep 2025',
    author: 'Bradley Pena',
  },
  {
    slug: 'discovering-hidden-corners',
    title: 'Discovering Hidden Corners of Cities Through Local Eyes',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=1000&fit=crop',
    date: '11 Sep 2025',
    author: 'Lara Bell',
  },
  {
    slug: 'architecture-as-art',
    title: 'Architecture as Art: Creativity in Every Line and Curve',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=1000&fit=crop',
    date: '11 Sep 2025',
    author: 'Bradley Pena',
  },
]
</script>

<style>
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
