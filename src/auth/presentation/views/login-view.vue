<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../application/auth.store.js'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { login, isAuthenticated } = useAuthStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const isFormDisabled = computed(() => !username.value.trim() || !password.value.trim())
const redirectTo = computed(() => {
  const destination = route.query.redirect
  return typeof destination === 'string' && destination.length > 0 ? destination : '/dashboard'
})

if (isAuthenticated.value) {
  router.replace(redirectTo.value)
}

const submitLogin = () => {
  errorMessage.value = ''

  const result = login({
    username: username.value,
    password: password.value
  })

  if (!result.success) {
    errorMessage.value = result.message
    return
  }

  router.push(redirectTo.value)
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <img class="auth-logo" src="/logo-hydrosmart.png" :alt="t('app.logoAlt')" />

      <h1 class="auth-title">{{ t('auth.login.title') }}</h1>
      <p class="auth-subtitle">{{ t('auth.login.subtitle') }}</p>

      <form class="auth-form" @submit.prevent="submitLogin">
        <label class="auth-field">
          <span>{{ t('auth.login.usernameLabel') }}</span>
          <input
            v-model="username"
            type="text"
            autocomplete="username"
            :placeholder="t('auth.login.usernamePlaceholder')"
          />
        </label>

        <label class="auth-field">
          <span>{{ t('auth.login.passwordLabel') }}</span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            :placeholder="t('auth.login.passwordPlaceholder')"
          />
        </label>

        <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>

        <button class="auth-submit" type="submit" :disabled="isFormDisabled">
          {{ t('auth.login.submit') }}
        </button>
      </form>

      <RouterLink class="auth-link" to="/forgot-password">
        {{ t('auth.login.forgotPassword') }}
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  align-items: center;
  background: #ececec;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem;
}

.auth-card {
  background: #f7f7f7;
  border: 1px solid #7c7c7c;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 0;
  max-width: 470px;
  min-height: 610px;
  padding: 2rem 2.6rem;
  width: 100%;
}

.auth-logo {
  height: 74px;
  margin-bottom: 0.8rem;
  object-fit: contain;
  width: 190px;
}

.auth-title {
  font-size: 1.55rem;
  margin: 0;
}

.auth-subtitle {
  color: #4b5563;
  margin: 0 0 0.4rem;
}

.auth-form {
  display: grid;
  gap: 0.95rem;
}

.auth-field {
  display: grid;
  font-weight: 700;
  gap: 0.5rem;
}

.auth-field input {
  background: #ffffff;
  border: 1.5px solid #727272;
  border-radius: 16px;
  font-size: 1rem;
  min-height: 56px;
  outline: none;
  padding: 0 1rem;
}

.auth-field input:focus {
  border-color: #0d2d5f;
  box-shadow: 0 0 0 2px rgba(13, 45, 95, 0.15);
}

.auth-error {
  color: #b91c1c;
  font-weight: 600;
  margin: -0.15rem 0 0;
}

.auth-submit {
  align-items: center;
  background: #001a49;
  border: none;
  border-radius: 999px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-size: 1.15rem;
  font-weight: 700;
  justify-content: center;
  margin: 0.35rem auto 0;
  min-height: 48px;
  padding: 0 2rem;
  width: min(260px, 100%);
}

.auth-submit:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.auth-link {
  color: #0d2d5f;
  font-weight: 600;
  margin-top: 0.55rem;
  text-align: center;
  text-decoration: underline;
}
</style>

