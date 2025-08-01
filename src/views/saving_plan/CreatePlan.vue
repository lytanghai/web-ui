<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Create Saving Plan</h2>
      <form @submit.prevent="submitPlan">
        <label>
          Plan Name:
          <input type="text" v-model="form.plan_name" required />
        </label>

        <label>
          Amount:
          <div class="currency-input">
            <input type="number" step="0.01" v-model="form.amount" required />
            <select v-model="form.amount_currency">
              <option value="USD">USD</option>
              <option value="KHR">KHR</option>
            </select>
          </div>
        </label>

        <label>
          Initial Amount:
          <div class="currency-input">
            <input type="number" step="0.01" v-model="form.initial_amount" required />
            <select v-model="form.initial_amount_currency">
              <option value="USD">USD</option>
              <option value="KHR">KHR</option>
            </select>
          </div>
        </label>

        <label>
          Target Date:
          <input type="date" v-model="form.target_date" required />
        </label>

        <div class="actions">
          <button type="submit">Submit</button>
          <button type="button" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// Initialize form object properly
const form = ref({
  plan_name: '',
  amount: 0,
  amount_currency: 'USD',
  initial_amount: 0,
  initial_amount_currency: 'USD',
  target_date: ''
})

const emit = defineEmits(['close'])
const submitPlan = async () => {
  try {
    const token = localStorage.getItem('jwt_token')
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }

    await axios.post(
      import.meta.env.VITE_SERVER_WEB_URL + import.meta.env.VITE_CREATE_NEW_SAVING_PLAN_URI,
      form.value,
      config
    )

    alert('Saving plan created successfully.')
    emit('close') // close modal after success
  } catch (err) {
    console.error(err)
    alert('Failed to create saving plan.')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 360px;
}

label {
  display: block;
  margin-bottom: 1rem;
  text-align: left;
}

.currency-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

input,
select {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}
</style>
