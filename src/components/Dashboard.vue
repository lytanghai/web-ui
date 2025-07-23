<template>
    <div class="homepage-body">
        <div class="home-header">
            <p>Date: {{ current }}</p>
        </div>

        <div class="box-container">
            <div class="panel add_expense" @click="showCreateExpense = true">
                <span> 📖 Expense 📖</span>
                <p>Add Expense</p>
            </div>
            <div class="panel my_expense" @click="showMyExpenses = true">
                <span>💰 Expense 💰</span>
                <p>My Expenses</p>
            </div>
            <div class="panel add_profit" @click="goTo('/list-expense')">
                <span>✏️ Profit ✏️</span>
                <p>Add Profit</p>
            </div>
            <div class="panel my_profit" @click="goTo('/trigger-message')">
                <span>📢 Profit 📢</span>
                <p>My Profits</p>
            </div>
            <div class="panel report" @click="goTo('/check-report')">
                <span>📊 Analyze 📊</span>
                <p>Reports</p>
            </div>
            <div class="panel planning" @click="goTo('/check-report')">
                <span>📊 Analyze 📊</span>
                <p>Planning</p>
            </div>

            <CreateExpense v-if="showCreateExpense" @close="showCreateExpense = false" />
            <MyExpenses v-if="showMyExpenses" @close="showMyExpenses = false" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import CreateExpense from '@/views/CreateExpense.vue'
import MyExpenses from '@/views/MyExpenses.vue'

const router = useRouter()

const loading = ref(false)
const showCreateExpense = ref(false)
const showMyExpenses = ref(false)

function goTo(path) {
    router.push(path)
}
const username = ref('')

onMounted(() => {
    // For demo: get username from localStorage or fallback
    username.value = localStorage.getItem('username') || 'ADMIN'
})

const current = ref('')

function formatDate(date) {
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yyyy = date.getFullYear()

    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    const HH = String(hours).padStart(2, '0')

    return `${dd}/${mm}/${yyyy} - ${HH}:${minutes}:${seconds} ${ampm}`
}


let intervalId = null

onMounted(() => {
    current.value = formatDate(new Date())
    intervalId = setInterval(() => {
        current.value = formatDate(new Date())
    }, 1000)
})

onUnmounted(() => {
    clearInterval(intervalId)
})

function logout() {
    loading.value = true

    setTimeout(() => {
        loading.value = false
        localStorage.clear()
        router.push('/')
    }, 2000)
}
</script>

<style scoped>
* {
    font-family: 'Courier New', Courier, monospace;
}

.home-header {
    width: auto;
    height: 50px;
    background-color: #e3963e;
    padding: .2rem;
    color: #000000;
    font-weight: bold;
    text-align: center;
}

.homepage-body {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: #19202e;
}

.box-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    max-width: 800px;
    margin: 40px auto;
    padding: 0 16px;
    margin-top: 5%;
}

.panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 120px;
    border-radius: 12px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s ease;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.panel span {
    font-size: 24px;
    margin-bottom: 8px;
}

.panel p {
    margin: 0;
    font-size: 1.2rem;
    color: #000;
}

.panel.add_expense {
    background-color: #1abc9c;
}

.panel.my_expense {
    background-color: #3498db;
}

.panel.add_profit {
    background-color: #f39c12;
}

.panel.report {
    background-color: #9b59b6;
}

.panel.my_profit {
    background-color: #e74c3c;
}

.panel.planning {
    background-color: #57d6a7;
}

.panel.logout {
    background-color: #3d7e80;
}

.panel:hover {
    transform: scale(1.05);
    opacity: 0.95;
}

@media screen and (max-width: 600px) {
    .container {
        display: block;
    }

    .home-header {
        font-size: 1.1rem;
    }

    .panel {
        width: 100%;
    }

    .panel a {
        padding: 20px;
        font-size: 1rem;
    }
}
</style>
