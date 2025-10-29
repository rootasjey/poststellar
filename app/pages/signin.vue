<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-12 px-6 bg-gray-50 dark:bg-gray-950">
    <!-- Logo -->
    <NuxtLink to="/" class="mb-12">
      <span class="font-title text-4xl font-bold text-black dark:text-white">Woords®</span>
    </NuxtLink>

    <!-- Card -->
    <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-10">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-black dark:text-white mb-2">Welcome back</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Welcome back! Please enter your details.</p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <input
            v-model="form.email"
            type="email"
            autocomplete="email"
            class="w-full rounded-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="Your email address"
          />
          <p v-if="errors.email" class="text-xs text-red-500 mt-2 px-2">{{ errors.email }}</p>
        </div>

        <div>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            class="w-full rounded-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="Your password"
          />
          <div class="flex items-center justify-between mt-2">
            <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" v-model="form.remember" class="w-4 h-4" />
              Remember me
            </label>
            <NuxtLink to="/forgot-password" class="text-sm text-gray-700 dark:text-gray-300 hover:underline">Forgot password?</NuxtLink>
          </div>
          <p v-if="errors.password" class="text-xs text-red-500 mt-2 px-2">{{ errors.password }}</p>
        </div>

        <div v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</div>

        <div>
          <button
            :disabled="isSubmitting"
            type="submit"
            class="w-full rounded-full px-6 py-4 bg-lime-300 hover:bg-lime-400 text-black font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="!isSubmitting">Sign in</span>
            <span v-else>Signing in…</span>
          </button>
        </div>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account yet? <NuxtLink to="/signup" class="text-black dark:text-white font-medium underline hover:no-underline">Sign up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const { loggedIn, fetch: refreshSession } = useUserSession()

const form = reactive({ email: '', password: '', remember: false })
const errors = reactive<{ email?: string; password?: string }>({})
const isSubmitting = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

function validate() {
  errors.email = ''
  if (!form.email) {
    errors.email = 'Email is required'
    return false
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address'
    return false
  }
  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }
  return true
}

async function onSubmit() {
  if (!validate()) return
  isSubmitting.value = true

  errorMessage.value = ''
  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: { email: form.email, password: form.password }
    })

    // Refresh session and navigate
    await refreshSession()
    router.push('/')
  } catch (e: any) {
    errorMessage.value = e?.data?.message || 'Invalid credentials'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped></style>
