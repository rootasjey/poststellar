import { ref, onMounted, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'

/**
 * Lightweight client-side mobile detector with SSR-safe fallback.
 * Important: starts as `false` on the client so initial render matches SSR and
 * prevents hydration mismatches. It updates after mounted to reflect the
 * real media query value.
 */
export function useIsMobile(query = '(max-width: 767px)') {
  if (!import.meta.client) {
    return ref(false)
  }

  const matches = useMediaQuery(query)
  const state = ref(false)

  onMounted(() => {
    // Initialize and keep state in sync after hydration
    state.value = matches.value
    watch(matches, (v) => (state.value = v))
  })

  return state
}
