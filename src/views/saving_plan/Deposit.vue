<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content" @click.stop>
      <LoadingSpinner v-if="loading" />
      <header class="modal-header">
        <h2>Deposit to {{ plan.planName }}</h2>
        <button class="close-btn" aria-label="Close" @click="close">×</button>
      </header>

      <form v-if="!showSuccess && !loading" @submit.prevent="handleSubmit" class="deposit-form">
        <label>
          Amount:
          <input v-model.number="amount" type="number" min="0.01" step="0.01" required placeholder="Enter amount"
            autofocus />
        </label>

        <label>
          Currency:
          <select v-model="currency" required>
            <option disabled value="">Select currency</option>
            <option v-for="cur in currencies" :key="cur" :value="cur">{{ cur }}</option>
          </select>
        </label>

        <div class="actions">
          <button type="submit" class="btn btn-primary">Apply</button>
          <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
        </div>
      </form>

      <!-- Show success after deposit -->
      <Successful v-if="showSuccess" :amount="successData.amount" :currency="successData.currency"
        :transactionDate="successData.transactionDate" :progress="successData.progress" @close="handleSuccessClose" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import Successful from '../../components/Successful.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import axios from 'axios'

const emit = defineEmits(['close'])
const props = defineProps({
  plan: {
    type: Object,
    required: true,
  },
})
const loading = ref(false)
const amount = ref(null)
const currency = ref(props.plan.targetCurrency || '')
const currencies = ['USD', 'KHR']

const showSuccess = ref(false)
const successData = ref({})

function close() {
  emit('close')
  amount.value = null
  currency.value = props.plan.targetCurrency || ''
}

async function deposit(planId, amount, currency) {
  const token = localStorage.getItem('jwt_token')
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }

  const body = {
    plan_id: planId,
    amount: amount,
    currency: currency,
  }

  try {
    const response = await axios.post(
      import.meta.env.VITE_SERVER_WEB_URL + import.meta.env.VITE_DEPOSIT_SAVING_PLAN,
      body,
      config
    )
    return response.data
  } catch (error) {

  }
}

async function handleSubmit() {
  loading.value = true
  try {
    if (!amount.value || !currency.value) {
      alert('Please enter amount and select currency')
      return
    }
    const data = await deposit(props.plan.id, amount.value, currency.value)
    successData.value = {
      amount: data.data.amount,
      currency: data.data.currency,
      transactionDate: data.data.transactionDate ?? new Date().toISOString(),
      progress: data.data.progress,
    }
    showSuccess.value = true
  } catch (err) {
    alert("Error! Something went wrong")
  } finally {
    loading.value = false
  }
}

function handleSuccessClose() {
  showSuccess.value = false
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 12000;
  padding: 1rem;
}

.modal-content {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  width: 320px;
  max-width: 90vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: #000;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #000;
}

.deposit-form label {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #333;
}

.deposit-form input,
.deposit-form select {
  margin-top: 0.3rem;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1.5px solid #ccc;
  transition: border-color 0.3s ease;
}

.deposit-form input:focus,
.deposit-form select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 6px rgba(79, 70, 229, 0.5);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.btn-secondary {
  background-color: #ddd;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #bbb;
}
</style>
