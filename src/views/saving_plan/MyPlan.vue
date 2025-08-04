<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content" @click.stop>
            <header class="modal-header">
                <h2>My Saving Plans</h2>
                <button class="close-btn" aria-label="Close modal" @click="close">×</button>
            </header>

            <form class="filter-form" @submit.prevent="fetchPlans(0)">
                <input v-model="filters.goalName" type="search" placeholder="Search by Goal Name"
                    aria-label="Filter plans by goal name" />

                <!-- SORT SELECT -->
                <select v-model="filters.sortBy" aria-label="Sort plans">
                    <option value="all">Sort: All</option>
                    <option value="completedFirst">Completed</option>
                    <option value="notCompletedFirst">Ongoing</option>
                </select>
                <!-- <button type="submit" class="btn btn-primary">Search</button> -->
            </form>

            <div class="cards-wrapper" v-if="!isLoading && filteredPlans.length">
                <div v-for="plan in filteredPlans" :key="plan.id" class="plan-card"
                    :class="{ completed: plan.targetAmount === plan.currentAmount }">
                    <!-- Completed mask overlay -->
                    <div v-if="plan.targetAmount === plan.currentAmount" class="completed-mask">
                        <span>Completed</span>
                    </div>

                    <div class="card-header">
                        <h3 class="goal-name">{{ plan.goalName }}</h3>
                        <span class="deadline">Deadline: {{ formatDate(plan.deadline) }}</span>

                    </div>
                    <p>Status: {{ isExpired(plan.deadline) ? 'Expired' : 'Ongoing' }}</p>
                    <div class="progress-container" role="progressbar" :aria-valuenow="progress(plan)" aria-valuemin="0"
                        aria-valuemax="100" :aria-label="`Progress for ${plan.goalName}`">
                        <div class="progress-bar" :style="{ width: progress(plan) + '%' }"></div>
                        <span class="progress-text">{{ progress(plan) }}%</span> <!-- Add this line -->
                    </div>

                    <div class="amounts">
                        <div>
                            <span class="label">Target:</span>
                            {{ formatAmount(plan.targetAmount, plan.targetCurrency) }}
                        </div>
                        <div>
                            <span class="label">Current:</span>
                            {{ formatAmount(plan.currentAmount, plan.currentCurrency) }}
                        </div>
                        <div>
                            <span class="label">Created:</span> {{ formatDate(plan.createdOn) }}
                        </div>
                    </div>

                    <div class="actions-row">
                        <button v-if="plan.targetAmount !== plan.currentAmount" class="btn btn-deposit"
                            @click="deposit(plan)" title="Deposit">
                            💰<span>Deposit</span>
                        </button>
                        <button class="btn btn-view" @click="view(plan)" title="View">
                            👁️<span>View</span>
                        </button>
                        <button class="btn btn-delete" @click="deletePlanPrompt(plan.id)" title="Delete">
                            🗑️<span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="!isLoading && !filteredPlans.length" class="empty-state">
                <p>No plans found.</p>
            </div>

            <div v-if="isLoading" class="loading-container">
                <LoadingSpinner />
            </div>

            <nav class="pagination" v-if="totalPages > 1">
                <button :disabled="page === 0" @click="fetchPlans(page - 1)">← Prev</button>
                <span>Page {{ page + 1 }} of {{ totalPages }}</span>
                <button :disabled="page + 1 >= totalPages" @click="fetchPlans(page + 1)">
                    Next →
                </button>
            </nav>

            <div v-if="showConfirmModal" class="confirm-modal-overlay" @click.self="cancelDelete">
                <div class="confirm-modal-content">
                    <h3>Confirm Deletion</h3>
                    <p>Are you sure you want to delete this plan?</p>
                    <div class="confirm-buttons">
                        <button @click="cancelDelete" class="btn btn-secondary">No</button>
                        <button @click="confirmDelete" class="btn btn-danger">Yes, Delete</button>
                    </div>
                </div>
            </div>

            <!-- Deposit modal -->
            <Deposit v-if="showDepositPanel" :plan="selectedPlanForDeposit" @close="handleDepositClose" />

            <!-- View history modal -->
            <ViewHistory v-if="isViewModalVisible" :planId="selectedPlanId" @close="isViewModalVisible = false" />
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    z-index: 10000;
    overflow-y: auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.modal-content {
    background: #fff;
    border-radius: 12px;
    width: 100%;
    max-width: 1350px;
    max-height: 90vh;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    padding: 1.5rem 2rem;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.modal-header h2 {
    font-weight: 700;
    font-size: 1.75rem;
    color: #4f46e5;
}

.close-btn {
    background: transparent;
    border: none;
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    color: #6b7280;
    transition: color 0.3s ease;
}

.close-btn:hover {
    color: #4338ca;
}

.filter-form {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.25rem;
}

.filter-form input[type='search'] {
    flex-grow: 1;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    border: 1.5px solid #e5e7eb;
    font-size: 1rem;
    color: #374151;
    transition: border-color 0.3s ease;
}

.filter-form input[type='search']:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 8px rgba(79, 70, 229, 0.5);
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    padding: 0.6rem 1.2rem;
    border: none;
    user-select: none;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    font-size: 1rem;
    gap: 0.5rem;
}

.btn-primary {
    background-color: #4f46e5;
    color: #fff;
}

.btn-primary:hover {
    background-color: #4338ca;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.6);
}

.cards-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.25rem;
    overflow-y: auto;
    max-height: 65vh;
    padding-right: 0.5rem;
}

.plan-card {
    background: #fff;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    box-shadow: 0 6px 14px rgb(0 0 0 / 0.08);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 0.95rem;
    position: relative;
    /* needed for overlay */
    border: 2px dashed #13b41e;
}

.completed-mask {
    position: absolute;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: 1.5rem;
    color: #10b981;
    border-radius: 12px;
    user-select: none;
    pointer-events: none;
    /* prevent interaction */
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
}

.goal-name {
    font-weight: 700;
    font-size: 1.2rem;
    color: #4f46e5;
}

.deadline {
    font-size: 0.85rem;
    color: #6b7280;
}

.progress-container {
    position: relative;
    background: #e5e7eb;
    border-radius: 9999px;
    height: 14px;
    width: 100%;
    margin-bottom: 1rem;
    overflow: hidden;
    box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.1);
}

.progress-bar {
    background: #4f46e5;
    height: 100%;
    border-radius: 9999px 0 0 9999px;
    transition: width 0.3s ease;
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 700;
    font-size: 0.8rem;
    color: rgb(24, 65, 179);
    user-select: none;
    pointer-events: none;
}

.amounts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-bottom: 1rem;
    justify-content: space-between;
}

.amounts>div {
    flex: 1 1 45%;
    color: #374151;
}

.label {
    color: #6b7280;
    font-weight: 600;
    font-size: 0.85rem;
}

.actions-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.6rem;
}

.actions-row .btn {
    flex: 1 1 45%;
    padding: 0.6rem 0;
    font-size: 0.9rem;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-deposit {
    background-color: #10b981;
    color: #fff;
}

.btn-deposit:hover {
    background-color: #059669;
    box-shadow: 0 3px 10px rgb(16 185 129 / 0.6);
}

.btn-view {
    background-color: #4f46e5;
    color: #fff;
}

.btn-view:hover {
    background-color: #4338ca;
    box-shadow: 0 3px 10px rgb(79 70 229 / 0.6);
}

.btn-delete {
    background-color: #ef4444;
    color: #fff;
}

.btn-delete:hover {
    background-color: #dc2626;
    box-shadow: 0 3px 10px rgb(239 68 68 / 0.6);
}

.empty-state {
    text-align: center;
    color: #6b7280;
    font-size: 1.1rem;
    padding: 3rem 0;
}

.loading-container {
    display: flex;
    justify-content: center;
    padding: 4rem 0;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0 0 0;
    color: #6b7280;
}

.pagination button {
    background-color: #f9fafb;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s ease;
}

.pagination button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.pagination button:not(:disabled):hover {
    background-color: #4f46e5;
    color: #fff;
    border-color: #4f46e5;
}

@media (max-width: 480px) {
    .modal-content {
        max-width: 100vw;
        max-height: 95vh;
        border-radius: 0;
        padding: 1rem;
    }

    .cards-wrapper {
        grid-template-columns: 1fr;
        max-height: 75vh;
    }

    .actions-row .btn {
        flex: 1 1 100%;
    }
}
</style>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue'
import axios from 'axios'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import Deposit from './Deposit.vue'
import ViewHistory from './ViewHistory.vue'

const emit = defineEmits(['close'])
const close = () => emit('close')

const isLoading = ref(false)
const plans = ref([])
const page = ref(0)
const size = 10
const totalPages = ref(1)


const filters = ref({
    goalName: '',
    sortBy: 'all', // default sorting option
})
const isExpired = (deadline) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
}
// Computed filtered and sorted plans
const filteredPlans = computed(() => {
    let filtered = plans.value

    // Filter by goalName (case insensitive)
    if (filters.value.goalName.trim() !== '') {
        filtered = filtered.filter((plan) =>
            plan.goalName.toLowerCase().includes(filters.value.goalName.toLowerCase())
        )
    }

    // Sort by completed or not
    if (filters.value.sortBy === 'completedFirst') {
        filtered = filtered.slice().sort((a, b) => {
            const aCompleted = a.currentAmount === a.targetAmount
            const bCompleted = b.currentAmount === b.targetAmount
            return (bCompleted === true) - (aCompleted === true) // true first
        })
    } else if (filters.value.sortBy === 'notCompletedFirst') {
        filtered = filtered.slice().sort((a, b) => {
            const aCompleted = a.currentAmount === a.targetAmount
            const bCompleted = b.currentAmount === b.targetAmount
            return (aCompleted === true) - (bCompleted === true) // false first
        })
    }

    return filtered
})

const showConfirmModal = ref(false)
const planToDeleteId = ref(null)

const showDepositPanel = ref(false)
const selectedPlanForDeposit = ref(null)

const selectedPlanId = ref(null)
const isViewModalVisible = ref(false)

async function fetchPlans(pageNum = 0) {
    if (pageNum < 0 || (totalPages.value && pageNum >= totalPages.value)) return
    isLoading.value = true
    try {
        const token = localStorage.getItem('jwt_token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page: pageNum,
                size,
            },
        }

        const response = await axios.get(
            import.meta.env.VITE_SERVER_WEB_URL + import.meta.env.VITE_FETCH_SAVING_PLAN_URI,
            config
        )
        const data = response.data.data

        // Map backend keys to frontend keys
        plans.value = data.content.map((plan) => ({
            id: plan.id,
            goalName: plan.plan_name,
            targetAmount: plan.target_amount,
            targetCurrency: plan.target_currency,
            currentAmount: plan.current_amount,
            currentCurrency: plan.current_amount_currency,
            createdOn: new Date(plan.created_at).toISOString().slice(0, 10),
            deadline: new Date(plan.deadline).toISOString().slice(0, 10),
            status: plan.status,
        }))

        totalPages.value = data.total_pages
        page.value = data.page
    } catch (error) {
        if (error.response && error.response.status === 403) {
            alert('Session expired or unauthorized. Please login again.')
            localStorage.removeItem('jwt_token')
            window.location.href = '/'
        } else {
            console.error('Error submitting profit:', error)
        }
    } finally {
        isLoading.value = false
    }
}

function formatAmount(amount, currency) {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount)
}

function formatDate(dateStr) {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

function progress(plan) {
    if (!plan.targetAmount) return 0
    return Math.min(100, Math.round((plan.currentAmount / plan.targetAmount) * 100))
}

function deletePlanPrompt(id) {
    planToDeleteId.value = id
    showConfirmModal.value = true
}

function cancelDelete() {
    planToDeleteId.value = null
    showConfirmModal.value = false
}

async function confirmDelete() {
    try {
        const token = localStorage.getItem('jwt_token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }

        await axios.post(
            `${import.meta.env.VITE_SERVER_WEB_URL}${import.meta.env.VITE_DELETE_SAVING_PLAN}`,
            {
                id: planToDeleteId.value,
            },
            config
        )


        // Remove deleted plan from UI
        plans.value = plans.value.filter((plan) => plan.id !== planToDeleteId.value)
        await fetchPlans();
        // Close modal
        cancelDelete()
    } catch (error) {
        console.error('Delete failed:', error)
        alert('Failed to delete the plan. Please try again.')
    }
}


function deposit(plan) {
    selectedPlanForDeposit.value = plan
    showDepositPanel.value = true
}

function handleDepositClose() {
    showDepositPanel.value = false
    fetchPlans(0) // Refresh plans on deposit close
}

function view(plan) {
    selectedPlanId.value = plan.id
    isViewModalVisible.value = true
}


onMounted(() => {
    fetchPlans(0)
})
</script>
