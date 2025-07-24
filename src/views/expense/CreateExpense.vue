<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <h2>Add Expense</h2>
            <form @submit.prevent="submitExpense">
                <LoadingSpinner v-if="loading" />
                <label>
                    Price:
                    <input type="number" step="0.01" v-model.number="expense.price" @blur="formatPrice" required />
                </label>

                <label>
                    Currency:
                    <select v-model="expense.currency" required>
                        <option value="USD">USD</option>
                        <option value="KHR">KHR</option>
                    </select>
                </label>

                <!-- Category Field -->
                <label>
                    Category:
                    <select v-model="selectedCategory" @change="onCategoryChange" required>
                        <option disabled value="">-- Select Category --</option>
                        <option value="Food">Food</option>
                        <option value="Drinks">Drinks</option>
                        <option value="Diesel">Diesel</option>
                        <option value="PTU">PTU</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                <!-- Show this only if "Other" is selected -->
                <label v-if="showCustomCategory">
                    Enter Custom Category:
                    <input type="text" v-model="customCategory" @input="updateCategory" required />
                </label>

                <label>
                    Item:
                    <input type="text" v-model="expense.item" required />
                </label>

                <label>
                    Note:
                    <textarea v-model="expense.note"></textarea>
                </label>

                <div class="btn-container">
                    <button type="button" @click="$emit('close')">Cancel</button>
                    <button type="submit">Create Expense</button>
                </div>
            </form>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const emit = defineEmits(['close', 'status'])

const selectedCategory = ref('')
const customCategory = ref('')
const showCustomCategory = ref(false)
const loading = ref(false)

function onCategoryChange() {
    showCustomCategory.value = selectedCategory.value === 'Other'
    if (!showCustomCategory.value) {
        expense.value.category = selectedCategory.value
    }
}

function updateCategory() {
    expense.value.category = customCategory.value
}

const expense = ref({
    price: '',
    currency: 'USD',
    category: '',
    item: '',
    note: ''
})

async function submitExpense() {
    try {
        loading.value = true
        const token = localStorage.getItem('jwt_token')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        await axios.post(
            import.meta.env.VITE_SERVER_WEB_URL + import.meta.env.VITE_CREATE_NEW_EXPENSE_URI,
            expense.value,
            config
        )

        // Emit status event to parent
        emit('status', {
            type: 'success',
            title: 'Expense Recorded',
            message: 'Your expense has been recorded successfully.'
        })
        // Let parent decide when to close
    } catch (error) {
        emit('status', {
            type: 'failure',
            title: 'Recorded Expense Failed',
            message: error.response?.data?.message || error.message || 'Unknown error'
        })
        if (error.response && error.response.status === 403) {
            alert('Session expired or unauthorized. Please login again.')
            localStorage.removeItem('jwt_token')
            window.location.href = '/'
        } else {
            console.error('Error fetching expenses:', error)
        }
    } finally {
        loading.value = false
    }
}

</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    width: 340px;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
    margin-bottom: 15px;
    text-align: center;
}

.modal-content form label {
    display: block;
    margin-bottom: 12px;
    font-weight: 600;
}

.modal-content input,
.modal-content textarea,
.modal-content select {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 14px;
}

.modal-content textarea {
    resize: vertical;
}

.modal-content button {
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 4px;
    font-weight: bold;
}

.modal-content button[type="submit"] {
    background-color: #4caf50;
    color: white;
    border: none;
}

.modal-content button[type="button"] {
    background-color: #ccc;
    border: none;
    color: black;
}

.btn-container {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}
</style>
