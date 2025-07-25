<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Update Profit</h2>
        <button class="close-btn" @click="close">❌</button>
      </div>

      <form @submit.prevent="submitUpdate">
        <div class="form-group">
          <label for="id">ID</label>
          <input type="text" id="id" v-model="form.id" readonly />
        </div>

        <div class="form-group">
          <label for="profitDate">Profit Date</label>
          <input type="text" id="profitDate" v-model="form.date" readonly />
        </div>

        <div class="form-group">
          <label for="category">Category</label>
          <input id="category" v-model="form.category" required />
        </div>

        <div class="form-group">
          <label for="pnlType">PnL Type</label>
          <input id="pnlType" v-model="form.pnl_type" required />
        </div>

        <div class="row-group">
          <div class="form-group">
            <label for="pnl">PnL</label>
            <input id="pnl" type="number" step="0.01" v-model.number="form.pnl" required />
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
            <label for="convertedAmount">Converted Amount</label>
            <input id="convertedAmount" type="number" :value="convertedAmount" readonly />
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

        <div class="form-actions update-btn">
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, defineProps, defineEmits, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({ profit: Object })
const emit = defineEmits(['close', 'updated'])

const form = reactive({
  id: '',
  date: '',
  category: '',
  pnl_type: '',
  pnl: 0,
  currency: '',
  note: '',
})

onMounted(() => {
  if (props.profit) {
    form.id = props.profit.id
    form.date = props.profit.date
    form.category = props.profit.category
    form.pnl_type = props.profit.pnl_type
    form.pnl = props.profit.pnl
    form.currency = props.profit.currency
    form.note = props.profit.note || ''
  }
})

const convertedCurrency = computed(() => {
  return form.currency === 'USD' ? 'KHR' : form.currency === 'KHR' ? 'USD' : ''
})

const convertedAmount = computed(() => {
  if (form.currency === 'USD') return (form.pnl * 4000).toFixed(2)
  if (form.currency === 'KHR') return (form.pnl / 4000).toFixed(2)
  return ''
})

async function submitUpdate() {
  try {
    const token = localStorage.getItem('jwt_token')
    const headers = { headers: { Authorization: `Bearer ${token}` } }

    const updateData = {
      id: form.id,
      category: form.category,
      pnl_type: form.pnl_type,
      pnl: form.pnl,
      currency: form.currency,
      note: form.note,
    }

    await axios.patch(
      import.meta.env.VITE_SERVER_WEB_URL + import.meta.env.VITE_UPDATE_PROFIT + '/' + updateData.id,
      updateData,
      headers
    )
    emit('updated', updateData)
  } catch (error) {
    console.error('Error updating profit:', error)
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
    margin-top: -5%
  }

  .row-group {
    flex-direction: column;
  }

  .form-actions {
    text-align: center;
  }
}

@media screen and (max-width: 480px) {
  .update-btn{
    margin-top: -2%;
  }
}
</style>
