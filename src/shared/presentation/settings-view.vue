<template>
  <section class="view-shell">
    <h1 class="view-title">{{ t('views.settings') }}</h1>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.view-shell {
  padding: 2rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}
</style>

