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
    expenses: Array,
    selectedOption: String,
    date1: String,
    date2: String,
    currentPage: Number,
    totalPages: Number
})

let totalByCurrency = {}; // e.g. { "USD": 25, "KHR": 25000 }

// 1. Sum prices by currency
props.expenses.forEach(exp => {
    const { currency, price } = exp;
    if (!totalByCurrency[currency]) {
        totalByCurrency[currency] = 0;
    }
    totalByCurrency[currency] += price;
});

console.log("Sum by currency:", totalByCurrency);


// 2. Convert to a base currency (USD)
let totalInUSD = 0;

for (const [currency, sum] of Object.entries(totalByCurrency)) {
    if (currency === "KHR") {
        totalInUSD += sum / 4000; // convert to USD
    } else if (currency === "USD") {
        totalInUSD += sum; // already in USD
    } else {
        console.warn(`Unknown currency: ${currency}`);
    }
}

console.log("💵 Total in USD:", totalInUSD.toFixed(2));
let totalInKHR = 0;

for (const [currency, sum] of Object.entries(totalByCurrency)) {
    if (currency === "KHR") {
        totalInKHR += sum;
    } else if (currency === "USD") {
        totalInKHR += sum * 4000; // convert to KHR
    }
}

console.log("🇰🇭 Total in KHR:", totalInKHR.toFixed(0));

const totalUSD = totalByCurrency.USD
const totalKHR = totalByCurrency.KHR
const sumUpUSD = totalInUSD.toFixed(2)
const sumupKHR = totalInKHR.toFixed(0)

const emit = defineEmits(['page-change'])

function handlePageChange(newPage) {
    if (newPage >= 0 && newPage < props.totalPages) {
        emit('page-changed', newPage)
    }
}

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

function formatUSD(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatKHR(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}


</script>

<template>
    <div class="result-wrapper">
        <h3 style="color: #000;">📊 Expense by Category</h3>

        <div class="summary-result">
            <p class="summary-desc">{{ filterDescription }}</p>

            <div class="summary-flex">
                <span>Total in USD:<strong>{{ formatUSD(totalUSD) }} USD</strong></span>
                <span>Total in KHR: <strong>{{ formatKHR(totalKHR) }} KHR</strong></span>
            </div>

            <div class="summary-flex">
                <span>Grand Total in USD: <strong>{{ formatUSD(sumUpUSD) }} USD</strong></span>
                <span>Grand Total in KHR: <strong>{{ formatKHR(sumupKHR) }} KHR</strong></span>
            </div>
        </div>

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
            <div class="pagination-controls">
                <button :disabled="currentPage <= 0" @click="handlePageChange(currentPage - 1)">Prev</button>
                <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
                <button :disabled="currentPage >= totalPages - 1"
                    @click="handlePageChange(currentPage + 1)">Next</button>
            </div>
        </div>
    </div>
</template>

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
    background-color: #fdfdfd;
}

thead th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 700;
    color: #0b0b0b;
    letter-spacing: 0.03em;
    user-select: none;
}

tbody tr {
    border-bottom: 1px solid #f4f6fa;
    transition: background-color 0.3s ease;
    cursor: default;
}

tbody tr:hover {
    background-color: #144d3e;
}

tbody td {
    padding: 0.65rem 1rem;
    color: #ffffff;
}

.pagination-controls {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

.pagination-controls button {
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.4rem 0.8rem;
    cursor: pointer;
    font-weight: 600;
}

.pagination-controls button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.pagination-controls span {
    font-weight: 600;
}

.summary-result {
    padding: 0.5rem 1.5rem;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #f9f9f9;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    margin-top: 1.5rem;
}

.summary-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.summary-desc {
    font-size: 0.95rem;
    margin-bottom: 1rem;
    color: #555;
    font-weight: bold;
}

.summary-flex {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
}

.summary-flex span {
    flex: 1 1 200px;
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


    .found-txn {
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
        /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
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