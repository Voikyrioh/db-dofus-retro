<script setup lang="ts">
import { ref } from 'vue'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import { login } from '../../services/authService'
import { useAuth } from '../../composables/useAuth'

const { setTokenFromCookie } = useAuth()

function navigate(page: string) {
  ;(window as any).navigateTo?.(page)
}

const username = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

async function handleSubmit() {
  error.value = null
  loading.value = true
  try {
    await login({ username: username.value, password: password.value })
    setTokenFromCookie()
    navigate('home')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />

    <main class="flex-1 container mx-auto px-4 py-8">
      <div class="max-w-md mx-auto">
        <h2 class="text-3xl font-bold text-center mb-8" v-translate="'login_title'"></h2>

        <form @submit.prevent="handleSubmit" class="bg-gray-800 rounded-lg p-6 flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-gray-300 text-sm" v-translate="'login_username_label'"></label>
            <input
              v-model="username"
              type="text"
              required
              class="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-gray-300 text-sm" v-translate="'login_password_label'"></label>
            <input
              v-model="password"
              type="password"
              required
              class="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded transition-colors"
            v-translate="'login_submit_button'"
          ></button>
        </form>

        <p class="text-center mt-4 text-gray-400">
          <span v-translate="'login_no_account'"></span>
          <a
            href="#"
            @click.prevent="navigate('register')"
            class="text-blue-400 hover:text-blue-300 ml-1"
            v-translate="'login_register_link'"
          ></a>
        </p>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
</style>
