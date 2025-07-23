<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>📊 Select Report Type</h2>
      <button class="report-btn expense" @click="select('expense')">📖 Expense Report</button>
      <button class="report-btn profit" @click="select('profit')">💰 Profit Report</button>
      <button class="cancel-btn" @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close', 'select'])

function select(type) {
  emit('select', type)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: #fff;
  border-radius: 16px;
  padding: 2rem;
  width: 320px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

h2 {
  margin-bottom: 1.5rem;
}

.report-btn {
  display: block;
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
}

.report-btn.expense {
  background-color: #1abc9c;
  color: #fff;
}

.report-btn.profit {
  background-color: #f39c12;
  color: #fff;
}

.report-btn:hover {
  opacity: 0.9;
}

.cancel-btn {
  margin-top: 1rem;
  background-color: #ccc;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
</style>
