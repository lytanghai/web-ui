<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>My Expenses</h2>
                <button class="close-btn" @click="close">❌</button>
            </div>

            <!-- Filter Form -->
            <div class="filter-form">
                <input v-model="filters.category" placeholder="Filter by Category" />
                <input v-model="filters.item" placeholder="Filter by Item" />
                <input v-model="filters.currency" placeholder="Filter by Currency" />
                <button @click="fetchExpenses(0)">Search</button>
            </div>

            <table class="expense-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Expense Date</th>
                        <th>Category</th>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Converted</th>
                        <th>Note</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="expense in expenses" :key="expense.id">
                        <td>{{ expense.id }}</td>
                        <td>{{ formatDate(expense.expense_date) }}</td>
                        <td>{{ expense.category }}</td>
                        <td>{{ expense.item }}</td>
                        <td>{{ expense.price }} {{ expense.currency }}</td>
                        <td>{{ expense.converted_price }} {{ expense.converted_currency }}</td>
                        <td>
                            <span>
                                {{ getShortNote(expense.note) }}
                                <button v-if="expense.note && expense.note.length > 30" class="view-note-btn"
                                    @click="viewFullNote(expense.note)">
                                    View
                                </button>
                            </span>
                        </td>
                        <td class="action-container">
                            <button class="action-btn edit">Edit</button>
                            <button class="action-btn delete" @click="deleteExpense(expense.id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="pagination">
                <button :disabled="page === 0" @click="fetchExpenses(page - 1)">Prev</button>
                <span>Page {{ page + 1 }} of {{ totalPages }}</span>
                <button :disabled="page + 1 === totalPages" @click="fetchExpenses(page + 1)">Next</button>
            </div>
        </div>

        <!-- Full Note Modal -->
        <div v-if="showNoteModal" class="note-modal-overlay" @click.self="closeNoteModal">
            <div class="note-modal-content">
                <h3>Note Detail</h3>
                <p>{{ fullNote }}</p>
                <button @click="closeNoteModal">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import axios from 'axios'

const emit = defineEmits(['close'])
const close = () => emit('close')

const expenses = ref([])
const page = ref(0)
const size = 10
const totalPages = ref(1)

// Filters
const filters = ref({
    category: '',
    item: '',
    currency: ''
})

// Note modal state
const showNoteModal = ref(false)
const fullNote = ref('')

const fetchExpenses = async (pageNum = 0) => {
    try {
        const token = localStorage.getItem('jwt_token')
        const headers = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }

        const requestBody = {
            expenseDate: '',
            category: filters.value.category,
            item: filters.value.item,
            currency: filters.value.currency,
            page: pageNum,
            size: size
        }

        const response = await axios.post(
            import.meta.env.VITE_SERVER_WEB_URL + import.meta.env.VITE_GET_EXPENSE_RECORD_URI,
            requestBody,
            headers
        )

        expenses.value = response.data.content
        totalPages.value = response.data.totalPages || 1
        page.value = pageNum
    } catch (error) {
        if (error.response && error.response.status === 403) {
            alert('Session expired or unauthorized. Please login again.')
            localStorage.removeItem('jwt_token')
            window.location.href = '/'
        } else {
            console.error('Error fetching expenses:', error)
        }
    }
}

const formatDate = (dateTimeStr) => {
    if (!dateTimeStr) return ''
    return dateTimeStr.split(' ')[0]
}

function getShortNote(note) {
    if (!note) return ''
    return note.length > 30 ? note.substring(0, 30) + '...' : note
}

function viewFullNote(note) {
    fullNote.value = note
    showNoteModal.value = true
}

function closeNoteModal() {
    showNoteModal.value = false
    fullNote.value = ''
}

// Example delete function - you can update to call your backend API
async function deleteExpense(id) {
    try {
        const token = localStorage.getItem('jwt_token')
        const headers = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        await axios.post(import.meta.env.VITE_SERVER_WEB_URL + import.meta.env.VITE_DELELE_EXPENSE, { id }, headers)
        // Refresh list after deletion
        fetchExpenses(page.value)
    } catch (error) {
        if (error.response && error.response.status === 403) {
            alert('Session expired or unauthorized. Please login again.')
            localStorage.removeItem('jwt_token')
            window.location.href = '/'
        } else {
            console.error('Error fetching expenses:', error)
        }
    }
}

onMounted(() => {
    fetchExpenses(0)
})
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
    z-index: 999;
}

.modal-content {
    background: white;
    width: 95%;
    max-width: 1200px;
    padding: 1rem;
    border-radius: 8px;
    position: relative;
    overflow-x: auto;
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

.filter-form {
    display: flex;
    gap: 10px;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.filter-form input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.filter-form button {
    padding: 5px 10px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.expense-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
}

.expense-table th,
.expense-table td {
    padding: 8px;
    border: 1px solid #ccc;
    text-align: center;
}

.expense-table th {
    background-color: #f0f0f0;
}

.action-container {
    display: flex;
    gap: 4px;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
}

.action-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 4px 6px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
}

.action-btn.delete {
    background-color: #e74c3c;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    gap: 10px;
}

.pagination button {
    padding: 5px 10px;
    border: none;
    background-color: #333;
    color: white;
    cursor: pointer;
    border-radius: 4px;
}

.view-note-btn {
    margin-left: 5px;
    background-color: transparent;
    border: none;
    color: #3498db;
    cursor: pointer;
    font-size: 0.8rem;
    text-decoration: underline;
    padding: 0;
}

.note-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.note-modal-content {
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    text-align: center;
}

.note-modal-content h3 {
    margin-bottom: 1rem;
}

.note-modal-content button {
    margin-top: 1rem;
    padding: 5px 10px;
    background-color: #3498db;
    border: none;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}
</style>
