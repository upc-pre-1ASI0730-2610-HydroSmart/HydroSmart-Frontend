<template>
  <section class="settings-container">
    <h1 class="settings-title">{{ t('settings.title') }}</h1>
    <div class="settings-grid">
      <!-- Modo de ahorro automático -->
      <div class="settings-card">
        <div class="settings-card-header">
          <span>{{ t('settings.autoMode.title') }}</span>
          <button class="settings-add-btn">+</button>
        </div>
        <div class="settings-switch-group">
          <label class="settings-switch">
            <input type="checkbox" v-model="autoClose" />
            <span class="slider"></span>
            {{ t('settings.autoMode.closeValves') }}
          </label>
          <label class="settings-switch">
            <input type="checkbox" v-model="blockAll" />
            <span class="slider"></span>
            {{ t('settings.autoMode.blockAll') }}
          </label>
          <label class="settings-switch">
            <input type="checkbox" v-model="block20" />
            <span class="slider"></span>
            {{ t('settings.autoMode.block20') }}
          </label>
          <label class="settings-switch">
            <input type="checkbox" v-model="reduceIntensity" />
            <span class="slider"></span>
            {{ t('settings.autoMode.reduceIntensity') }}
          </label>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const autoClose = ref(false)
const blockAll = ref(true)
const block20 = ref(false)
const reduceIntensity = ref(true)
</script>

<style scoped>
.settings-container {
  padding: 2rem;
}
.settings-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
}
.settings-card {
  background: #fff;
  border: 1.5px solid #b6c6d6;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  margin-bottom: 1rem;
}
.settings-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.settings-add-btn {
  background: #0a2c47;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 1.2rem;
  cursor: pointer;
}
.settings-switch-group {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.settings-switch {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1rem;
  font-weight: 400;
}
.settings-switch input[type="checkbox"] {
  accent-color: #0a2c47;
  width: 20px;
  height: 20px;
}
</style>
