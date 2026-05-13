<template>
  <section class="help-page">
    <h1 class="help-title">{{ t('settings.help.contact') }}</h1>
    <div class="help-content">
      <p>Escríbenos y nuestro equipo de soporte te responderá en breve.</p>
      <form @submit.prevent="sendContact">
        <label>Tu correo
          <input v-model="email" type="email" required />
        </label>
        <label>Mensaje
          <textarea v-model="message" rows="6" required></textarea>
        </label>
        <div style="margin-top:0.6rem">
          <button class="settings-save" type="submit">Enviar</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const email = ref('')
const message = ref('')

function sendContact() {
  // Simular envío
  alert(t('settings.help.contact') + ' — ' + t('settings.saved'))
  email.value = ''
  message.value = ''
}
</script>

<style scoped>
.help-page { padding: 2rem; }
.help-title { font-size: 1.6rem; color: #0a2c47; margin-bottom: 1rem }
.help-content { background:#fff; border:1px solid #e6f0fb; padding:1.2rem; border-radius:12px }
.help-content label { display:block; margin-bottom:0.6rem }
.help-content input, .help-content textarea { width:100%; padding:0.6rem; border:1px solid #dbe7f2; border-radius:8px }
</style>

