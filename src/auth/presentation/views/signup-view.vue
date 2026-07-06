<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../application/auth.store.js'

const { t } = useI18n()
const router = useRouter()
const { register, isAuthenticated } = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('user')
const errorMessage = ref('')
const isLoading = ref(false)

const isFormDisabled = computed(() => 
  !email.value.trim() || 
  !password.value.trim() || 
  !confirmPassword.value.trim() ||
  password.value !== confirmPassword.value
)

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return !email.value || emailRegex.test(email.value)
})

const passwordsMatch = computed(() => 
  !password.value || !confirmPassword.value || password.value === confirmPassword.value
)

if (isAuthenticated.value) {
  router.replace('/dashboard')
}

const submitSignUp = async () => {
  errorMessage.value = ''

  if (!isEmailValid.value) {
    errorMessage.value = 'Por favor ingresa un correo electrónico válido'
    return
  }

  if (!passwordsMatch.value) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  isLoading.value = true

  try {
    const result = await register({
      email: email.value,
      password: password.value,
      role: role.value
    })

    if (!result.success) {
      errorMessage.value = result.message
      isLoading.value = false
      return
    }

    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message || 'Error al crear la cuenta'
    isLoading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <img class="auth-logo" src="/logo-hydrosmart.png" alt="HydroSmart" />

      <h1 class="auth-title">Crear cuenta</h1>
      <p class="auth-subtitle">Únete a HydroSmart</p>

      <form class="auth-form" @submit.prevent="submitSignUp">
        <label class="auth-field">
          <span>Correo electrónico</span>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="tu@correo.com"
            :class="{ 'invalid': email && !isEmailValid }"
          />
          <span v-if="email && !isEmailValid" class="field-error">
            Correo electrónico inválido
          </span>
        </label>

        <label class="auth-field">
          <span>Contraseña</span>
          <input
            v-model="password"
            type="password"
            autocomplete="new-password"
            placeholder="Mínimo 6 caracteres"
          />
        </label>

        <label class="auth-field">
          <span>Confirmar contraseña</span>
          <input
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="Confirma tu contraseña"
            :class="{ 'invalid': confirmPassword && !passwordsMatch }"
          />
          <span v-if="confirmPassword && !passwordsMatch" class="field-error">
            Las contraseñas no coinciden
          </span>
        </label>

        <label class="auth-field">
          <span>Rol (opcional)</span>
          <select v-model="role" class="auth-select">
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
            <option value="technician">Técnico</option>
          </select>
        </label>

        <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>

        <button 
          class="auth-submit" 
          type="submit" 
          :disabled="isFormDisabled || isLoading"
        >
          {{ isLoading ? 'Creando cuenta...' : 'Crear cuenta' }}
        </button>
      </form>

      <div class="auth-footer">
        <span>¿Ya tienes cuenta? </span>
        <RouterLink class="auth-link" to="/login">
          Inicia sesión
        </RouterLink>
      </div>
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
  min-height: auto;
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

.auth-field input,
.auth-field select {
  background: #ffffff;
  border: 1.5px solid #727272;
  border-radius: 16px;
  font-size: 1rem;
  min-height: 56px;
  outline: none;
  padding: 0 1rem;
  font-family: inherit;
}

.auth-field input.invalid,
.auth-field select.invalid {
  border-color: #b91c1c;
}

.auth-field input:focus,
.auth-field select:focus {
  border-color: #0d2d5f;
  box-shadow: 0 0 0 2px rgba(13, 45, 95, 0.15);
}

.field-error {
  color: #b91c1c;
  font-size: 0.875rem;
  font-weight: 600;
  margin: -0.45rem 0 0;
}

.auth-select {
  background: #ffffff;
  border: 1.5px solid #727272;
  border-radius: 16px;
  cursor: pointer;
  font-size: 1rem;
  min-height: 56px;
  outline: none;
  padding: 0 1rem;
}

.auth-select:focus {
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
  transition: opacity 0.2s;
}

.auth-submit:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.auth-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.auth-footer {
  color: #4b5563;
  font-weight: 600;
  margin-top: 0.55rem;
  text-align: center;
}

.auth-link {
  color: #0d2d5f;
  font-weight: 700;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
