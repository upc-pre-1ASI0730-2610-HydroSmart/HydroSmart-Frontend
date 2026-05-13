<template>
  <section class="help-page">
    <h1 class="help-title">{{ t('settings.help.center') }}</h1>
    <div class="help-content">
      <p>Encuentra preguntas frecuentes, artículos y guías para resolver dudas sobre HydroSmart.</p>
      <ul>
        <li>¿Cómo añadir dispositivos?</li>
        <li>¿Cómo recibir reportes por correo?</li>
        <li>Guía rápida de ahorro de agua</li>
      </ul>
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

