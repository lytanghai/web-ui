<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2 style="color:#000">Deposit History</h2>

      <div v-if="isLoading" class="loading">Loading history...</div>
      <LoadingSpinner v-if="isLoading" />
      <table v-else-if="records.length">
        <thead>
          <tr>
            <th style="width: 40%;">Date</th>
            <th style="width: 30%;">Amount</th>
            <th style="width: 30%;">Currency</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td class="date-cell">{{ record.date }}</td>
            <td>{{ record.amount }}</td>
            <td>{{ record.currency }}</td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">No deposit history found.</div>

      <div class="pagination" v-if="totalPages > 1">
        <button :disabled="page === 0" @click="changePage(page - 1)">← Prev</button>
        <span>Page {{ page + 1 }} of {{ totalPages }}</span>
        <button :disabled="page + 1 >= totalPages" @click="changePage(page + 1)">Next →</button>
      </div>

      <button class="close-btn" @click="$emit('close')"></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { format } from 'date-fns'

const props = defineProps({
  planId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['close'])

const records = ref([])
const isLoading = ref(false)
const error = ref(null)
const page = ref(0)
const size = 10
const totalPages = ref(0)

async function fetchHistory() {
  if (!props.planId) return

  isLoading.value = true
  error.value = null

  try {
    const token = localStorage.getItem('jwt_token')
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_WEB_URL}${import.meta.env.VITE_CHECK_HISTORY}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          planId: props.planId,
          page: page.value,
          size,
        },
      }
    )


    const data = response.data.data
    records.value = data.content.map((item) => ({
      id: item.id,
      amount: item.amount,
      currency: item.currency,
      date: format(new Date(item.deposited_date), 'dd-MM-yyyy HH:mm:ss'),
    }))
    totalPages.value = data.total_pages
  } catch (err) {
    if (err.response?.status === 403) {
      alert('Session expired or unauthorized. Please login again.')
      localStorage.removeItem('jwt_token')
      window.location.href = '/'
    } else {
      console.error('Failed to fetch deposit history:', err)
      error.value = 'Failed to load history'
    }
    records.value = []
  } finally {
    isLoading.value = false
  }
}

function changePage(newPage) {
  if (newPage >= 0 && newPage < totalPages.value) {
    page.value = newPage
    fetchHistory()
  }
}

onMounted(fetchHistory)
watch(() => props.planId, fetchHistory)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  width: 600px;
  max-height: 90vh;
  border-radius: 12px;
  position: relative;
  overflow-x: auto;
  overflow-y: auto;
  max-width: 100vw;
}

.loading,
.empty-state {
  text-align: center;
  padding: 2rem;
  font-weight: bold;
  color: #555;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
}

.close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  background: #f0f0f0;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background-color 0.3s ease, transform 0.2s ease;
  user-select: none;
}

.close-btn::before,
.close-btn::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 2px;
  background-color: #555;
  border-radius: 1px;
  transition: background-color 0.3s ease;
}

.close-btn::before {
  transform: rotate(45deg);
}

.close-btn::after {
  transform: rotate(-45deg);
}

.close-btn:hover,
.close-btn:focus {
  background-color: #4f46e5;
  outline: none;
  transform: scale(1.1);
}

.close-btn:hover::before,
.close-btn:hover::after,
.close-btn:focus::before,
.close-btn:focus::after {
  background-color: #fff;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  table-layout: fixed;
}

th,
td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #ccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date-cell {
  white-space: nowrap;
}

@media (max-width: 480px) {

  .modal-overlay{
    overflow: hidden;
    width: 90%;
    height: 90%;
  }

  .modal-content {
    margin-left: -15px;
    margin-bottom: -50px;
    padding: 1rem;
    width: 85vw;
    min-height: 780px;
  }

  table {
    table-layout: auto;
    color: #000;
  }

  th,
  td {
    text-align: center;
    font-size: 0.9rem;
    white-space: nowrap;
  }
}
</style>
