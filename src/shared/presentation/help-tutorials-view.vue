<template>
  <section class="help-page">
    <h1 class="help-title">{{ t('settings.help.tutorials') }}</h1>
    <div class="help-content">
      <p>Videos y guías paso a paso.</p>
      <ol>
        <li>Cómo conectar un nuevo dispositivo</li>
        <li>Configurar notificaciones y reportes</li>
        <li>Mejores prácticas de ahorro</li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.help-page { padding: 2rem; }
.help-title { font-size: 1.6rem; color: #0a2c47; margin-bottom: 1rem }
.help-content { background:#fff; border:1px solid #e6f0fb; padding:1.2rem; border-radius:12px }
</style>

