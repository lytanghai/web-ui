<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>Deposit Successfully</h2>

      <div class="detail-row">
        <span class="label">Amount :</span>
        <span class="value">{{ amount }}</span>
      </div>

      <div class="detail-row">
        <span class="label">Currency:</span>
        <span class="value">{{ currency }}</span>
      </div>

      <div class="detail-row">
        <span class="label">Transaction Date:</span>
        <span class="value">{{ formattedDate }}</span>
      </div>

      <div class="detail-row">
        <span class="label">New Progress:</span>
        <span class="value progress">{{ progress }} %</span>
      </div>

      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format } from 'date-fns'

const props = defineProps({
  amount: {
    type: [Number, String],
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  transactionDate: {
    type: [String, Date],
    required: true
  },
  progress: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const formattedDate = computed(() => {
  if (!props.transactionDate) return '-'
  const date = typeof props.transactionDate === 'string' ? new Date(props.transactionDate) : props.transactionDate
  // Format like: 01-08-2025 12:42:00 PM
  return format(date, 'dd-MM-yyyy hh:mm:ss a')
})

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  width: 500px;
  box-sizing: border-box;
  text-align: left;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  margin-bottom: 1.5rem;
  color: #059669;
  text-align: center;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.label {
  font-weight: 600;
  color: #374151;
}

.value {
  font-weight: 700;
  color: #111827;
}

.progress {
  color: #10b981;
}

button {
  display: block;
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.5rem 0;
  background-color: #10b981;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.25s ease;
}

button:hover {
  background-color: #059669;
}
</style>
