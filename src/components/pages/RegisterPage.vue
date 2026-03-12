<script setup lang="ts">
import { ref } from 'vue'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import { register } from '../../services/authService'

const username = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

function navigate(page: string) {
  ;(window as any).navigateTo?.(page)
}

async function handleSubmit() {
  error.value = null
  loading.value = true
  try {
    await register({ username: username.value, email: email.value, password: password.value, confirm: confirm.value })
    navigate('login')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Registration failed'
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
        <h2 class="text-3xl font-bold text-center mb-8" v-translate="'register_title'"></h2>

        <form @submit.prevent="handleSubmit" class="bg-gray-800 rounded-lg p-6 flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-gray-300 text-sm" v-translate="'register_username_label'"></label>
            <input
              v-model="username"
              type="text"
              required
              class="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-gray-300 text-sm" v-translate="'register_email_label'"></label>
            <input
              v-model="email"
              type="email"
              required
              class="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-gray-300 text-sm" v-translate="'register_password_label'"></label>
            <input
              v-model="password"
              type="password"
              required
              class="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-gray-300 text-sm" v-translate="'register_confirm_label'"></label>
            <input
              v-model="confirm"
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
            v-translate="'register_submit_button'"
          ></button>
        </form>

        <p class="text-center mt-4 text-gray-400">
          <span v-translate="'register_have_account'"></span>
          <a
            href="#"
            @click.prevent="navigate('login')"
            class="text-blue-400 hover:text-blue-300 ml-1"
            v-translate="'register_login_link'"
          ></a>
        </p>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
</style>
