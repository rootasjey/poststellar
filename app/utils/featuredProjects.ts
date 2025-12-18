export type FeaturedProjectSummary = {
  slug: string
  title: string
  image: string
}

export const FEATURED_PROJECT_TAG = 'featured project'
export const FEATURED_PROJECTS_KEY = 'featured-projects'
export const FEATURED_PROJECT_FALLBACK_IMAGE = 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg'

export const FALLBACK_PROJECTS: FeaturedProjectSummary[] = [
  {
    slug: 'a-game-of-life',
    title: "A Game of Life: Building the Conway's Simulation",
    image: 'https://images.pexels.com/photos/776654/pexels-photo-776654.jpeg?w=800&h=600&fit=crop',
  },
  {
    slug: 'mobile-app-design',
    title: 'Mobile App Design: Creating Intuitive User Experiences',
    image: 'https://images.pexels.com/photos/8780204/pexels-photo-8780204.jpeg?w=800&h=600&fit=crop',
  },
  {
    slug: 'brand-identity-redesign',
    title: "Brand Identity Redesign: From Concept to Launch",
    image: 'https://images.pexels.com/photos/2993940/pexels-photo-2993940.jpeg?w=800&h=600&fit=crop',
  },
  {
    slug: 'web-application-dashboard',
    title: 'Web Application Dashboard: Data Visualization Project',
    image: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg?w=800&h=600&fit=crop',
  },
  {
    slug: 'automation-workflow',
    title: 'Automation Workflow: Streamlining Business Processes',
    image: 'https://images.pexels.com/photos/168866/pexels-photo-168866.jpeg?w=800&h=600&fit=crop',
  },
]
