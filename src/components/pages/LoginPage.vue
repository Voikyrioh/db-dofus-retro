<script setup lang="ts">
import { ref } from 'vue'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import OrnateCorners from '../atoms/OrnateCorners.vue'
import { login } from '../../services/authService'
import { useAuth } from '../../composables/useAuth'

const { setTokenFromCookie, setUser } = useAuth()

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
    const authUser = await login({ username: username.value, password: password.value })
    setUser(authUser)
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
  <div class="page-wrapper">
    <Header />

    <main class="auth-main">
      <div class="auth-card card-ornate">
        <OrnateCorners />

        <h2 class="auth-title" v-translate="'login_title'"></h2>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="field">
            <label class="field-label" v-translate="'login_username_label'"></label>
            <input
              v-model="username"
              type="text"
              required
              class="input-field"
            />
          </div>

          <div class="field">
            <label class="field-label" v-translate="'login_password_label'"></label>
            <input
              v-model="password"
              type="password"
              required
              class="input-field"
            />
          </div>

          <p v-if="error" class="form-error">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="btn-primary submit-btn"
            v-translate="'login_submit_button'"
          ></button>
        </form>

        <p class="auth-footer-text">
          <span v-translate="'login_no_account'"></span>
          <a
            href="#"
            @click.prevent="navigate('register')"
            class="auth-link"
            v-translate="'login_register_link'"
          ></a>
        </p>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
  background: linear-gradient(160deg, var(--color-bg-nav-top) 0%, var(--color-bg-nav) 100%);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 2rem 2rem 1.5rem;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-accent);
  text-align: center;
  margin: 0 0 1.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.form-error {
  color: var(--color-error);
  font-size: 0.85rem;
  margin: 0;
}

.submit-btn {
  width: 100%;
  padding: 0.6rem 1rem;
  margin-top: 0.25rem;
}

.auth-footer-text {
  text-align: center;
  margin: 1.25rem 0 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.auth-link {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 700;
  margin-left: 0.25rem;
}

.auth-link:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
}
</style>
