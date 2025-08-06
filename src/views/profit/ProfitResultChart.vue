<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {getGrandTotal, formatCurrencyString} from '../../composable/common'
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
  profits: {
    type: Array,
    default: () => []
  },
  selectedOption: String,
  date1: String,
  date2: String,
  currentPage: Number,
  totalPages: Number,
  totalKHR: Number,
  totalUSD: Number
})

const emit = defineEmits(['page-changed'])

function handlePageChange(newPage) {
  if (newPage >= 0 && newPage < props.totalPages) {
    emit('page-changed', newPage)
  }
}

// Group profits by category and sum pnl
function groupByCategory(profits) {
  const grouped = {}
  profits.forEach(profit => {
    if (!grouped[profit.category]) {
      grouped[profit.category] = 0
    }
    const sign = profit.pnl_type === '+' ? 1 : profit.pnl_type === '-' ? -1 : 0
    grouped[profit.category] += profit.pnl * sign
  })
  return grouped
}

const usdData = computed(() => {
  const filtered = props.profits.filter(p => p.currency === 'USD')
  const grouped = groupByCategory(filtered)
  return {
    labels: Object.keys(grouped),
    datasets: [
      {
        label: 'USD Profit',
        data: Object.values(grouped),
        backgroundColor: '#42A5F5'
      }
    ]
  }
})

const khrData = computed(() => {
  const filtered = props.profits.filter(p => p.currency === 'KHR')
  const grouped = groupByCategory(filtered)
  return {
    labels: Object.keys(grouped),
    datasets: [
      {
        label: 'KHR Profit',
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
    <h3 style="color: #000;">📊 Profit by Category</h3>

    <div class="summary-result">
      <p class="summary-desc">{{ filterDescription }}</p>

      <div class="summary-flex">
        <span>Total in USD: <strong>{{ formatCurrencyString(totalUSD) }}</strong></span>
        <span>Total in KHR: <strong>{{ formatCurrencyString(totalKHR) }}</strong></span>
      </div>

      <div class="summary-flex">
        <span>Grand Total in USD: <strong>{{ getGrandTotal(totalUSD, totalKHR, "USD") }}</strong></span>
        <span>Grand Total in KHR: <strong>{{ getGrandTotal(totalUSD, totalKHR, "KHR") }}</strong></span>
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
          - {{ profits.length }} record{{ profits.length !== 1 ? 's' : '' }}
        </span>
      </h4>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>PnL Type</th>
            <th>PnL</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="profit in profits" :key="profit.id">
            <td data-label="Date">{{ profit.profit_date }}</td>
            <td data-label="Category">{{ profit.category }}</td>
            <td data-label="PnL Type">{{ profit.pnl_type }}</td>
            <td data-label="PnL">{{ profit.pnl.toFixed(2) }}</td>
            <td data-label="Currency">{{ profit.currency }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination-controls">
        <button :disabled="currentPage <= 0" @click="handlePageChange(currentPage - 1)">Prev</button>
        <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
        <button :disabled="currentPage >= totalPages - 1" @click="handlePageChange(currentPage + 1)">Next</button>
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