<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Update Expense</h2>
        <button class="close-btn" @click="close">❌</button>
      </div>

      <form @submit.prevent="submitUpdate">
        <div class="form-group">
          <label for="id">ID</label>
          <input type="text" id="id" v-model="form.id" readonly />
        </div>

        <div class="form-group">
          <label for="expenseDate">Expense Date</label>
          <input type="text" id="expenseDate" v-model="form.expense_date" readonly />
        </div>

        <div class="form-group">
          <label for="category">Category</label>
          <input id="category" v-model="form.category" required />
        </div>

        <div class="form-group">
          <label for="item">Item</label>
          <input id="item" v-model="form.item" required />
        </div>

        <div class="row-group">
          <div class="form-group">
            <label for="price">Price</label>
            <input id="price" type="number" step="0.01" v-model.number="form.price" required />
          </div>

          <div class="form-group">
            <label for="currency">Currency</label>
            <select id="currency" v-model="form.currency" required>
              <option value="USD">USD</option>
              <option value="KHR">KHR</option>
            </select>
          </div>
        </div>

        <div class="row-group">
          <div class="form-group">
            <label for="convertedPrice">Converted Price</label>
            <input id="convertedPrice" type="number" :value="convertedPrice" readonly />
          </div>

          <div class="form-group">
            <label for="convertedCurrency">Converted Currency</label>
            <input id="convertedCurrency" :value="convertedCurrency" readonly />
          </div>
        </div>

        <div class="form-group">
          <label for="note">Note</label>
          <textarea id="note" v-model="form.note"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, defineProps, defineEmits, onMounted } from 'vue'
import axios from 'axios'

const emit = defineEmits(['updated', 'close'])
const props = defineProps({
  expense: Object,
})

const form = reactive({
  id: '',
  expense_date: '',
  category: '',
  item: '',
  price: 0,
  currency: '',
  note: '',
})

onMounted(() => {
  if (props.expense) {
    form.id = props.expense.id
    form.expense_date = props.expense.expense_date
    form.category = props.expense.category
    form.item = props.expense.item
    form.price = props.expense.price
    form.currency = props.expense.currency
    form.note = props.expense.note || ''
  }
})

const convertedCurrency = computed(() => {
  return form.currency === 'USD' ? 'KHR' : form.currency === 'KHR' ? 'USD' : ''
})

const convertedPrice = computed(() => {
  if (form.currency === 'USD') return (form.price * 4000).toFixed(2)
  if (form.currency === 'KHR') return (form.price / 4000).toFixed(2)
  return ''
})

async function submitUpdate() {
  try {
    const token = localStorage.getItem('jwt_token')
    const headers = { headers: { Authorization: `Bearer ${token}` } }

    const updateData = {
      id: form.id,
      category: form.category,
      item: form.item,
      price: form.price,
      currency: form.currency,
      note: form.note,
    }

    await axios.patch(
      import.meta.env.VITE_SERVER_WEB_URL + import.meta.env.VITE_UPDATE_EXPENSE + '/' + updateData.id,
      updateData,
      headers
    )
    emit('updated', updateData)
  } catch (error) {

  }
}

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
}

.modal-content {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  max-width: 500px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.form-group input[readonly] {
  background-color: #eee;
  cursor: not-allowed;
}

.row-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.row-group .form-group {
  flex: 1;
  min-width: 140px;
}

.form-actions {
  text-align: right;
  margin-top: 1.5rem;
}

button[type='submit'] {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
}

/* Responsive for mobile */
@media (max-width: 500px) {
  .modal-content {
    padding: 1rem;
    width: 95vw;
  }

  .row-group {
    flex-direction: column;
  }

  .form-actions {
    text-align: center;
  }
}
</style>
