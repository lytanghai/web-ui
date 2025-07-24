<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
    expenses: {
        type: Array,
        required: true
    },
    selectedOption: {
        type: String,
        required: true
    },
    date1: {
        type: String,
        required: false,
        default: ''
    },
    date2: {
        type: String,
        required: false,
        default: ''
    }
})

// Group expenses by category and sum prices
function groupByCategory(expenses) {
    const grouped = {}
    expenses.forEach(exp => {
        if (!grouped[exp.category]) {
            grouped[exp.category] = 0
        }
        grouped[exp.category] += exp.price
    })
    return grouped
}

const usdData = computed(() => {
    const filtered = props.expenses.filter(e => e.currency === 'USD')
    const grouped = groupByCategory(filtered)
    return {
        labels: Object.keys(grouped),
        datasets: [
            {
                label: 'USD Expenses',
                data: Object.values(grouped),
                backgroundColor: '#42A5F5'
            }
        ]
    }
})

const khrData = computed(() => {
    const filtered = props.expenses.filter(e => e.currency === 'KHR')
    const grouped = groupByCategory(filtered)
    return {
        labels: Object.keys(grouped),
        datasets: [
            {
                label: 'KHR Expenses',
                data: Object.values(grouped),
                backgroundColor: '#66BB6A'
            }
        ]
    }
})

const filterDescription = computed(() => {
    const formatDate = dateStr => {
        if (!dateStr) return 'Invalid Date'
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-GB') // dd/mm/yyyy
    }

    if (props.selectedOption === 'specific') {
        return `Specific Date (${formatDate(props.date1)} 00:00:00 - ${formatDate(
            props.date1
        )} 23:59:59)`
    } else if (props.selectedOption === 'range') {
        return `Range (${formatDate(props.date1)} 00:00:00 - ${formatDate(props.date2)} 23:59:59)`
    } else if (props.selectedOption === 'thisMonth') {
        return `This Month (${formatDate(props.date1)} - ${formatDate(props.date2)})`
    }
    return ''
})
</script>

<template>
    <div class="result-wrapper">
        <h3 style="color: #000;">📊 Expense by Category</h3>
        <p style="margin-bottom: 1rem; color: #555; font-size: 0.95rem;">
            Summary: {{ filterDescription }}
        </p>

        <div style="margin-bottom: 2rem">
            <h4>$ USD $</h4>
            <Bar :data="usdData" />
        </div>

        <div>
            <h4>៛ KHR ៛</h4>
            <Bar :data="khrData" />
        </div>

        <div class="table-section">
            <h4>
                📄 History
                <span class="found-txn">
                    - {{ expenses.length }} record{{ expenses.length !== 1 ? 's' : '' }}
                </span>
            </h4>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Item</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="expense in expenses" :key="expense.id">
                        <td data-label="Date">{{ expense.expense_date }}</td>
                        <td data-label="Category">{{ expense.category }}</td>
                        <td data-label="Item">{{ expense.item }}</td>
                        <td data-label="Price" style="text-align: left;">
                            {{ expense.price }} {{ expense.currency === 'USD' ? '$' : '៛' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
/* Keep your styles as you had them */
</style>
