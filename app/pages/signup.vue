<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-12 px-6 bg-gray-50 dark:bg-gray-950">
    <!-- Logo -->
    <NuxtLink to="/" class="mb-12">
      <span class="font-title text-4xl font-bold text-black dark:text-white">Woords®</span>
    </NuxtLink>

    <!-- Card -->
    <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-10">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-black dark:text-white mb-2">Create your account</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Start publishing and subscribing in minutes.</p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <input
            v-model="form.name"
            type="text"
            autocomplete="name"
            class="w-full rounded-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="Your name"
          />
          <p v-if="errors.name" class="text-xs text-red-500 mt-2 px-2">{{ errors.name }}</p>
        </div>

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
            autocomplete="new-password"
            class="w-full rounded-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
            placeholder="Create a password (min 8 characters)"
          />
          <div class="flex items-center justify-between mt-2">
            <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" v-model="showPassword" class="w-4 h-4" />
              Show password
            </label>
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
            <span v-if="!isSubmitting">Create account</span>
            <span v-else>Creating…</span>
          </button>
        </div>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account? <NuxtLink to="/signin" class="text-black dark:text-white font-medium underline hover:no-underline">Sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const { fetch: refreshSession } = useUserSession()

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const errors = reactive<{ name?: string; email?: string; password?: string }>({})
const showPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

function validate() {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  let ok = true
  if (!form.name || form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
    ok = false
  }
  if (!form.email) {
    errors.email = 'Email is required'
    ok = false
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address'
    ok = false
  }
  if (!form.password) {
    errors.password = 'Password is required'
    ok = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    ok = false
  }
  return ok
}

async function onSubmit() {
  if (!validate()) return
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/register', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        password: form.password
      }
    })

    // Refetch session and go home
    await refreshSession()
    navigateTo('/')
  } catch (e: any) {
    errorMessage.value = e?.data?.message || 'Failed to create account'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped></style>
