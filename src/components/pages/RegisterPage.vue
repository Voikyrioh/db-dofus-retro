<script setup lang="ts">
import { ref } from 'vue'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import OrnateCorners from '../atoms/OrnateCorners.vue'
import { register } from '../../services/authService'

const username = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref<string | null>(null)
const loading = ref(false)
const registered = ref(false)

function navigate(page: string) {
  ;(window as any).navigateTo?.(page)
}

async function handleSubmit() {
  error.value = null
  loading.value = true
  try {
    await register({ username: username.value, email: email.value, password: password.value, confirm: confirm.value })
    registered.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-wrapper">
    <Header />

    <main class="auth-main">
      <!-- Confirmation après inscription réussie -->
      <div v-if="registered" class="auth-card card-ornate">
        <OrnateCorners />
        <div class="success-icon">✓</div>
        <h2 class="auth-title success-title" v-translate="'register_success_title'"></h2>
        <p class="success-message" v-translate="'register_success_message'"></p>
        <button
          class="btn-primary submit-btn"
          @click="navigate('login')"
          v-translate="'register_success_cta'"
        ></button>
      </div>

      <!-- Formulaire d'inscription -->
      <div v-else class="auth-card card-ornate">
        <OrnateCorners />

        <h2 class="auth-title" v-translate="'register_title'"></h2>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="field">
            <label class="field-label" v-translate="'register_username_label'"></label>
            <input
              v-model="username"
              type="text"
              required
              class="input-field"
            />
          </div>

          <div class="field">
            <label class="field-label" v-translate="'register_email_label'"></label>
            <input
              v-model="email"
              type="email"
              required
              class="input-field"
            />
          </div>

          <div class="field">
            <label class="field-label" v-translate="'register_password_label'"></label>
            <input
              v-model="password"
              type="password"
              required
              class="input-field"
            />
          </div>

          <div class="field">
            <label class="field-label" v-translate="'register_confirm_label'"></label>
            <input
              v-model="confirm"
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
            v-translate="'register_submit_button'"
          ></button>
        </form>

        <p class="auth-footer-text">
          <span v-translate="'register_have_account'"></span>
          <a
            href="#"
            @click.prevent="navigate('login')"
            class="auth-link"
            v-translate="'register_login_link'"
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

/* Confirmation */
.success-icon {
  font-size: 3rem;
  color: var(--color-success);
  text-align: center;
  margin-bottom: 0.5rem;
}
.success-title {
  color: var(--color-success);
  margin-bottom: 0.75rem;
}
.success-message {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin: 0 0 1.5rem;
}
</style>
