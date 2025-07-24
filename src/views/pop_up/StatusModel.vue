<template>
  <div v-if="visible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <header class="modal-header" :class="statusClass">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="closeModal" aria-label="Close">×</button>
      </header>
      <section class="modal-body">
        <p>{{ message }}</p>
      </section>
      <footer class="modal-footer">
        <button @click="closeModal">{{ closeText }}</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: Boolean,
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  status: { type: String, default: 'success' }, // 'success' | 'failure'
  closeText: { type: String, default: 'Close' }
})

const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}

const statusClass = props.status === 'success' ? 'status-success' : 'status-failure'
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999; /* VERY HIGH to be on top */
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  padding: 1.5rem;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid transparent;
}

.status-success {
  border-color: #2ecc71; /* green */
  color: #27ae60;
}

.status-failure {
  border-color: #e74c3c; /* red */
  color: #c0392b;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  color: inherit;
}

.modal-body {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #333;
}

.modal-footer {
  text-align: right;
}

.modal-footer button {
  background-color: #3498db;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
}

.modal-footer button:hover {
  background-color: #2980b9;
}
</style>
