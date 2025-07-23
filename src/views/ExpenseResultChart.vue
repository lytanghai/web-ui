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
    }
})

// Helper function to group by category and sum prices
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
</script>

<style scoped>
h3,
h4 {
    color: #000;
}

.table-section {
    margin-top: 2rem;
    background: #1e2a3a;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    color: #f0f0f0;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    overflow-x: auto;
}

.table-section h4 {
    margin-bottom: 1rem;
    font-weight: 600;
    font-size: 1.25rem;
    color: #1abc9c;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
    min-width: 600px;
    /* helps responsiveness */
}

thead {
    background-color: #921494;
}

thead th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.03em;
    user-select: none;
}

tbody tr {
    border-bottom: 1px solid #2f3a4a;
    transition: background-color 0.3s ease;
    cursor: default;
}

tbody tr:hover {
    background-color: #144d3e;
}

tbody td {
    padding: 0.65rem 1rem;
    color: #000000;
}

@media (max-width: 600px) {
    table {
        font-size: 0.85rem;
        min-width: 100%;
    }
}

@media screen and (max-width: 480px) {
    .table-section {
        padding: 0.5rem;
    }


    .found-txn{
        font-size: 1rem;
        color: #a73e3e
    }

    table {
        border: 0;
    }

    thead {
        display: none;
        /* Hide header on mobile */
    }

    tbody tr {
        display: block;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    tbody tr:hover {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    }

    tbody td {
        display: flex;
        justify-content: space-between;
        padding: 0.3rem 0;
        border-bottom: 1px solid rgba(26, 24, 24, 0.3);
        font-weight: 600;
    }

    tbody td:last-child {
        border-bottom: none;
    }

    tbody td::before {
        content: attr(data-label);
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        opacity: 0.7;
    }
}
</style>
<template>
    <div class="result-wrapper">
        <h3>📊 Expense by Category</h3>

        <div style="margin-bottom: 2rem">
            <h4>USD</h4>
            <Bar :data="usdData" />
        </div>

        <div>
            <h4>KHR</h4>
            <Bar :data="khrData" />
        </div>

        <div class="table-section">
            <h4>📄 History  <span class="found-txn"> - {{ expenses.length }} record{{ expenses.length !== 1 ? 's' : '' }} </span> </h4>
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
                        <td data-label="Price">{{ expense.price }} {{ expense.currency }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
