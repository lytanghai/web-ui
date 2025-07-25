<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2 style="text-decoration: underline;">Profit Records</h2>
                <button class="close-btn" @click="close">❌</button>
            </div>

            <!-- Filter Form -->
            <div class="filter-form">
                <input v-model="filters.category" placeholder="Category" />
                <input v-model="filters.pnl_type" placeholder="PnL Type (+/-)" />
                <input v-model="filters.currency" placeholder="Currency" />
                <button @click="fetchProfits(0)">Search</button>
            </div>

            <div class="table-wrapper">
                <LoadingSpinner v-if="isLoading" />
                <table class="expense-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Profit Date</th>
                            <th>PnL Type</th>
                            <th>Category</th>
                            <th>PnL</th>
                            <th>Currency</th>
                            <th>Converted PnL</th>
                            <th>Converted Currency</th>
                            <th>Note</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="profit in profits" :key="profit.id">
                            <td>{{ profit.id }}</td>
                            <td>{{ formatDate(profit.date) }}</td>
                            <td>{{ profit.pnl_type }}</td>
                            <td>{{ profit.category }}</td>
                            <td>{{ profit.pnl }}</td>
                            <td>{{ profit.currency }}</td>
                            <td>{{ profit.converted_price }}</td>
                            <td>{{ profit.converted_currency }}</td>
                            <td>
                                <span v-if="profit.note && profit.note.length <= 30">
                                    {{ profit.note }}
                                </span>
                                <span v-else-if="profit.note">
                                    {{ profit.note.slice(0, 30) }}...
                                    <button class="view-note-btn" @click="viewFullNote(profit.note)">View</button>
                                </span>
                                <span v-else>-</span>
                            </td>
                            <td class="action-container">
                                <button class="action-btn edit" @click="openUpdateModal(profit)">Edit</button>
                                <button class="action-btn delete" @click="deleteProfitPrompt(profit.id)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>

            <div class="pagination">
                <button :disabled="page === 0" @click="fetchProfits(page - 1)">Prev</button>
                <span>Page {{ page + 1 }} of {{ totalPages }}</span>
                <button :disabled="page + 1 >= totalPages" @click="fetchProfits(page + 1)">Next</button>
            </div>
        </div>

        <!-- Update Expense Modal (conditionally rendered) -->
        <UpdateProfit v-if="showUpdateModal" :profit="selectedProfit" @updated="handleUpdated"
            @close="closeUpdateModal" />

        <!-- Full Note Modal -->
        <div v-if="showNoteModal" class="note-modal-overlay" @click.self="closeNoteModal">
            <div class="note-modal-content">
                <h3>Note Detail</h3>
                <p>{{ fullNote }}</p>
                <button @click="closeNoteModal">Close</button>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <div v-if="showConfirmModal" class="confirm-modal-overlay" @click.self="cancelDelete">
            <div class="confirm-modal-content">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this profit?</p>
                <div class="confirm-buttons">
                    <button @click="cancelDelete">No</button>
                    <button @click="confirmDelete">Sure!</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import axios from 'axios'
import UpdateProfit from './UpdateProfit.vue'

const emit = defineEmits(['close'])
const close = () => emit('close')

const isLoading = ref(false)
const profits = ref([])
const page = ref(0)
const size = 10
const totalPages = ref(1)

const showUpdateModal = ref(false)
const selectedProfit = ref(null)

function openUpdateModal(profit) {
    selectedProfit.value = { ...profit }
    showUpdateModal.value = true
}

function closeUpdateModal() {
    showUpdateModal.value = false
    selectedProfit.value = null
}

function handleUpdated() {
    showUpdateModal.value = false
    fetchProfits(page.value) // Refresh list
}

const filters = ref({
    category: '',
    pnl_type: '',
    currency: ''
})

const showNoteModal = ref(false)
const fullNote = ref('')

const showConfirmModal = ref(false)
const profitToDeleteId = ref(null)

function fetchProfits(pageNum = 0) {
    if (pageNum < 0 || (totalPages.value && pageNum >= totalPages.value)) return

    isLoading.value = true
    const token = localStorage.getItem('jwt_token')
    const headers = { headers: { Authorization: `Bearer ${token}` } }
    const requestBody = {
        date: '',
        category: filters.value.category,
        pnl_type: filters.value.pnl_type,
        currency: filters.value.currency,
        pnl: filters.value.pnl,
        page: pageNum,
        size: size
    }
    axios.post(import.meta.env.VITE_SERVER_WEB_URL + import.meta.env.VITE_GET_PROFIT_RECORD_URI, requestBody, headers)
        .then(response => {
            profits.value = response.data.content
            totalPages.value = response.data.total_pages || 1
            page.value = pageNum
        })
        .catch(error => {
            if (error.response && error.response.status === 403) {
                alert('Session expired or unauthorized. Please login again.')
                localStorage.removeItem('jwt_token')
                window.location.href = '/'
            } else {
                console.error('Error fetching profits:', error)
            }
        })
        .finally(() => {
            isLoading.value = false
        })
}

const formatDate = (dateTimeStr) => dateTimeStr || ''

function viewFullNote(note) {
    fullNote.value = note
    showNoteModal.value = true
}
function closeNoteModal() {
    showNoteModal.value = false
    fullNote.value = ''
}

function deleteProfitPrompt(id) {
    profitToDeleteId.value = id
    showConfirmModal.value = true
}
function cancelDelete() {
    profitToDeleteId.value = null
    showConfirmModal.value = false
}
async function confirmDelete() {
    if (!profitToDeleteId.value) return
    try {
        const token = localStorage.getItem('jwt_token')
        const headers = { headers: { Authorization: `Bearer ${token}` } }
        await axios.post(import.meta.env.VITE_SERVER_WEB_URL + import.meta.env.VITE_DELETE_PROFIT, { id: profitToDeleteId.value }, headers)
        fetchProfits(page.value)
    } catch (error) {
        if (error.response && error.response.status === 403) {
            alert('Session expired or unauthorized. Please login again.')
            localStorage.removeItem('jwt_token')
            window.location.href = '/'
        } else {
            console.error('Error deleting profit:', error)
        }
    }
    profitToDeleteId.value = null
    showConfirmModal.value = false
}

onMounted(() => {
    fetchProfits(0)
})
</script>

<style scoped>
/* Your existing styles */
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
    padding: 1rem;
    box-sizing: border-box;
}

.modal-content {
    background: white;
    padding: 0 1.5rem;
    border-radius: 8px;
    width: 100%;
    /* max-width: 1000px; */
    height: 95vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.close-btn {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.filter-form {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.filter-form input {
    flex: 1;
    padding: 6px 8px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    min-width: 120px;
}

.filter-form button {
    padding: 6px 12px;
    font-size: 1rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.table-wrapper {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}

.expense-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    word-wrap: break-word;
}

.expense-table th,
.expense-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: center;
  vertical-align: top;
  white-space: normal;
  word-break: break-word;
}

.action-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0.5rem;
}

.action-btn {
    width: 100%;
    white-space: nowrap;
    padding: 6px 8px;
    font-size: 0.9rem;
}

.action-btn.edit {
    background-color: #0f971e;
    color: white;
}

.action-btn.delete {
    background-color: #e74c3c;
    color: white;
}

.view-note-btn {
    margin-left: 6px;
    background: transparent;
    border: none;
    color: #3498db;
    cursor: pointer;
    font-size: 0.85rem;
}

/* Fix pagination at bottom */
.pagination {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    background-color: white;
    border-top: 1px solid #ccc;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.05);
}

.note-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.note-modal-content {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    text-align: center;
}

.confirm-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 11000;
}

.confirm-modal-content {
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 10px;
    max-width: 350px;
    width: 90%;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.confirm-modal-content h3 {
    margin-bottom: 1rem;
    font-weight: 600;
}

.confirm-modal-content p {
    margin-bottom: 1.5rem;
    font-size: 1rem;
    color: #333;
}

.confirm-buttons {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
}

.confirm-buttons button {
    flex: 1;
    padding: 0.5rem 0;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.confirm-buttons button:first-child {
    background-color: #ccc;
    color: #333;
}

.confirm-buttons button:first-child:hover {
    background-color: #b3b3b3;
}

.confirm-buttons button:last-child {
    background-color: #e74c3c;
    color: white;
}

.confirm-buttons button:last-child:hover {
    background-color: #c0392b;
}

@media screen and (max-width: 768px) {
    .modal-content {
        max-width: 95%;
        padding: 1rem;
    }

    .filter-form {
        flex-direction: column;
    }

    .expense-table thead tr th:first-child {
        width: 20px;
    }

    .expense-table thead tr th {
        width: 50px;
        font-size: 0.7rem;
    }

    .expense-table th,
    .expense-table td {
        text-align: center;
        font-size: 0.8rem;
        padding: 0.4rem;
    }

    .action-btn {
        font-size: 0.75rem;
    }

    .view-note-btn {
        font-size: 0.75rem;
    }
}

@media screen and (max-width: 480px) {
    .modal-content {
        max-width: 95vw;
        max-height: 90vh;
        overflow-y: auto;
        padding: 1rem;
        margin-top: -5%;
    }

    .filter-form {
        flex-direction: column;
    }

    .filter-form input,
    .filter-form button {
        width: 100%;
        box-sizing: border-box;
    }

    .expense-table {
        display: block;
    }

    .expense-table thead {
        display: none;
    }

    .expense-table tbody,
    .expense-table tr {
        display: block;
        margin-bottom: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 0.5rem;
        box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
    }

    .expense-table td {
        display: flex;
        justify-content: space-between;
        padding: 0.3rem 0.5rem;
        border: none;
        border-bottom: 1px solid #eee;
    }

    .expense-table td:last-child {
        border-bottom: none;
    }

    .expense-table td:nth-child(1)::before {
        content: "ID:";
        font-weight: 600;
    }

    .expense-table td:nth-child(2)::before {
        content: "Date:";
        font-weight: 600;
    }

    .expense-table td:nth-child(3)::before {
        content: "Category:";
        font-weight: 600;
    }

    .expense-table td:nth-child(4)::before {
        content: "Item:";
        font-weight: 600;
    }

    .expense-table td:nth-child(5)::before {
        content: "Price:";
        font-weight: 600;
    }

    .expense-table td:nth-child(6)::before {
        content: "Converted:";
        font-weight: 600;
    }

    .expense-table td:nth-child(7)::before {
        content: "Note:";
        font-weight: 600;
    }

    .expense-table td:nth-child(8)::before {
        content: "Actions";
        font-weight: 600;
    }

    .action-container {
        flex-direction: column;
        gap: 0.3rem;
    }

    .action-btn {
        width: 100%;
        text-align: center;
        padding: 8px 0;
    }

    .pagination {
        flex-direction: row;
        justify-content: center;
        gap: 1rem;
    }
}
</style>
