<template>
    <div class="container">
        <div class="expense-report">
            <header class="report-header">
                <h2>📖 Expense Report</h2>
            </header>

            <section class="filter-section">
                <button class="back-btn" @click="goHome">← Back</button>
                <h3>📅 Filter Options</h3>

                <!-- Specific Date -->
                <div class="filter-option">
                    <label>
                        <input type="radio" value="specific" v-model="selectedOption" />
                        Specific Date
                    </label>
                    <input type="date" style="width: fit-content;" v-if="selectedOption === 'specific'"
                        v-model="specificDate" />
                </div>

                <!-- Range Date -->
                <div class="filter-option">
                    <label>
                        <input type="radio" value="range" v-model="selectedOption" />
                        Range Date
                    </label>
                    <div v-if="selectedOption === 'range'" class="range-inputs">
                        <input type="date" v-model="rangeStartDate" @change="validateRange" />
                        <input type="date" v-model="rangeEndDate" @change="validateRange" />
                    </div>
                    <p v-if="rangeError" class="error">{{ rangeError }}</p>
                </div>

                <!-- This Month -->
                <div class="filter-option">
                    <label>
                        <input type="radio" value="thisMonth" v-model="selectedOption" />
                        This Month
                    </label>
                </div>

                <button class="apply-btn" @click="applyFilter">Apply Filter</button>
            </section>
        </div>

        <!-- Modal only for showing chart results -->
        <div v-if="showResults" class="modal-overlay" @click.self="closeModal">
            <div class="modal-box">
                <button class="modal-close" @click="closeModal">×</button>
                <ExpenseResultChart :expenses="expenses" />
            </div>
        </div>
        <LoadingSpinner v-if="isLoading" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ExpenseResultChart from '@/views/expense/ExpenseResultChart.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'

const router = useRouter()

const isLoading = ref(false)
const selectedOption = ref('specific')
const specificDate = ref('')
const rangeStartDate = ref('')
const rangeEndDate = ref('')
const rangeError = ref('')
const expenses = ref([])
const showResults = ref(false)
const SERVER_WEB_URL = import.meta.env.VITE_SERVER_WEB_URL
const FETCH_SPC_DATE = import.meta.env.VITE_FETCH_EXPENSE_BY_SPC_DATE
const FETCH_RNG_DATE_START = import.meta.env.VITE_FETCH_EXPENSE_BY_RNG_DATE_START
const FETCH_RNG_DATE_END = import.meta.env.VITE_FETCH_EXPENSE_BY_RNG_DATE_END
const FETCH_MONTHLY = import.meta.env.VITE_FETCH_EXPENSE_BY_MONTHLY

function validateRange() {
    rangeError.value = ''
    if (rangeStartDate.value && rangeEndDate.value) {
        const start = new Date(rangeStartDate.value)
        const end = new Date(rangeEndDate.value)
        if (end <= start) {
            rangeError.value = 'End date must be later than start date.'
        }
    }
}

function closeModal() {
    showResults.value = false
}

function goHome() {
    router.push('/home')
}

async function applyFilter() {
    rangeError.value = ''
    let url = ''
    const token = localStorage.getItem('jwt_token')

    showResults.value = false
    expenses.value = []

    if (!token) {
        alert('No token found!')
        return
    }

    if (selectedOption.value === 'specific') {
        if (!specificDate.value) return alert('Please select a date.')
        url = `${SERVER_WEB_URL}${FETCH_SPC_DATE}${specificDate.value}`
    } else if (selectedOption.value === 'range') {
        if (!rangeStartDate.value || !rangeEndDate.value) {
            return alert('Please select both start and end dates.')
        }

        const start = new Date(rangeStartDate.value)
        const end = new Date(rangeEndDate.value)

        if (end <= start) {
            rangeError.value = 'End date must be after start date.'
            return
        }

        url = `${SERVER_WEB_URL}${FETCH_RNG_DATE_START}${rangeStartDate.value}${FETCH_RNG_DATE_END}${rangeEndDate.value}`
    } else if (selectedOption.value === 'thisMonth') {
        url = `${SERVER_WEB_URL}${FETCH_MONTHLY}`
    }

    try {
        isLoading.value = true
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        expenses.value = response.data.data?.content || []
        showResults.value = true
    } catch (error) {
        if (error.response && error.response.status === 403) {
            alert('Session expired or unauthorized. Please login again.')
            localStorage.removeItem('jwt_token')
            window.location.href = '/'
        } else {
            console.error('Error fetching expenses:', error)
            alert('An error occurred while fetching expenses.')
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
* {
    overflow: hidden;
    font-family: 'Courier New', Courier, monospace;

}

.back-btn {
    background-color: #2980b9;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    margin: 0 0 1rem 0;
    display: inline-block;
    transition: background-color 0.3s ease;
}

.back-btn:hover {
    background-color: #1f5a89;
}

input[type="date"] {
    width: fit-content;
}

.container {
    padding: 1.5rem;
    background-color: #19202e;
    position: absolute;
    width: 100%;
    min-height: 100vh;
    left: 0;
    top: 0;
    color: #fff;
    box-sizing: border-box;
    overflow-y: auto;
}

.expense-report {
    max-width: 600px;
    margin: auto;
    margin-top: 10%;
}

.report-header h2 {
    margin-bottom: 1rem;
    text-align: center;
    font-size: 1.6rem;
}

.filter-section {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 8px;
    background-color: #1e2a3a;
}

.filter-option {
    margin-bottom: 1rem;
}

.filter-option label {
    display: block;
    margin-bottom: 0.5rem;
}

input[type='date'] {
    width: 100%;
    padding: 0.4rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
}

.range-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

@media (min-width: 500px) {
    .range-inputs {
        flex-direction: row;
        align-items: center;
    }
}

.error {
    color: red;
    font-size: 0.9rem;
}

.apply-btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
}

.apply-btn:hover {
    background-color: #2980b9;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    box-sizing: border-box;
}

.modal-box {
    background-color: #fff;
    padding: 2rem;
    border-radius: 10px;
    width: 100%;
    max-width: 1000px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-sizing: border-box;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 14px;
    font-size: 1.8rem;
    background: transparent;
    border: none;
    cursor: pointer;
}

/* Make chart scrollable on smaller screens */
@media (max-width: 768px) {


    .modal-box {
        padding: 1rem;
    }

    .report-header h2 {
        font-size: 1.4rem;
    }

    .apply-btn {
        font-size: 0.95rem;
    }
}

@media screen and (max-width: 480px) {
    .report-header {
        margin-top: 40%;
    }
}
</style>
