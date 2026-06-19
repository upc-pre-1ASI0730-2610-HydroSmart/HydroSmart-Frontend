<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()

const email = ref('')

const isFormDisabled = computed(() => !email.value.trim())

const submitRequest = () => {
  email.value = email.value.trim()
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <img class="auth-logo" src="/logo-hydrosmart.png" :alt="t('app.logoAlt')" />

      <h1 class="auth-title">{{ t('auth.forgot.title') }}</h1>
      <p class="auth-subtitle">{{ t('auth.forgot.subtitle') }}</p>

      <form class="auth-form" @submit.prevent="submitRequest">
        <label class="auth-field">
          <span>{{ t('auth.forgot.emailLabel') }}</span>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            :placeholder="t('auth.forgot.emailPlaceholder')"
          />
        </label>

        <button class="auth-submit" type="submit" :disabled="isFormDisabled">
          {{ t('auth.forgot.submit') }}
        </button>
      </form>

      <RouterLink class="auth-link" to="/login">
        {{ t('auth.forgot.backToLogin') }}
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
  gap: 0.95rem;
  margin: 0;
  max-width: 470px;
  min-height: 500px;
  padding: 2rem 2.6rem;
  width: 100%;
}

.auth-logo {
  height: 74px;
  margin-bottom: 0.7rem;
  object-fit: contain;
  width: 190px;
}

.auth-title {
  font-size: 1.5rem;
  margin: 0;
}

.auth-subtitle {
  color: #4b5563;
  margin: 0 0 0.3rem;
}

.auth-form {
  display: grid;
  gap: 1rem;
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

.auth-submit {
  align-items: center;
  background: #001a49;
  border: none;
  border-radius: 999px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-size: 1.05rem;
  font-weight: 700;
  justify-content: center;
  margin: 0.3rem auto 0;
  min-height: 48px;
  padding: 0 2rem;
  width: min(280px, 100%);
}

.auth-submit:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}


.auth-link {
  color: #0d2d5f;
  font-weight: 600;
  margin-top: 0.2rem;
  text-align: center;
  text-decoration: underline;
}
</style>

