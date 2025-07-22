<template>
    <div class="homepage-body">
        <div class="home-header">
            <p>Welcome Home! {{ username }}</p>
            <p>Date: {{ current }}</p>
        </div>

        <div class="box-container">
            <div class="panel new_expense" @click="showCreateExpense = true">
                <span>📖 01 📖</span>
                <p>Create Expense</p>
            </div>
            <div class="panel view_expense" @click="goTo('/get-expense')">
                <span>💰 02 💰</span>
                <p>View Expense</p>
            </div>
            <div class="panel update_expense" @click="goTo('/list-expense')">
                <span>✏️ 03 ✏️</span>
                <p>Update Expense</p>
            </div>
            <div class="panel check_report" @click="goTo('/check-report')">
                <span>📊 04 📊</span>
                <p>Check Report</p>
            </div>
            <div class="panel send_message" @click="goTo('/trigger-message')">
                <span>📢 05 📢</span>
                <p>Send Message</p>
            </div>
            <div class="panel logout" @click="logout">
                <LoadingSpinner :visible="loading" />
                <p style="font-size: 2rem;">Logout</p>
            </div>

            <CreateExpense v-if="showCreateExpense" @close="showCreateExpense = false" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import CreateExpense from '@/components/CreateExpense.vue'

const router = useRouter()

const loading = ref(false)
const showCreateExpense = ref(false)


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
    height: 100px;
    background-color: #e3963e;
    padding: 1rem;
    color: #000000;
    font-weight: bold;
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
    margin-top: 12%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    max-width: 800px;
    margin: 40px auto;
    padding: 0 16px;
    margin-top: 10%;
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

.panel.new_expense {
    background-color: #1abc9c;
}

.panel.view_expense {
    background-color: #3498db;
}

.panel.update_expense {
    background-color: #f39c12;
}

.panel.check_report {
    background-color: #9b59b6;
}

.panel.send_message {
    background-color: #e74c3c;
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

    .box-container {
        margin-top: 10%;
    }

    .panel {
        width: 100%;
        margin-bottom: 16px;
    }

    .panel a {
        padding: 20px;
        font-size: 1rem;
    }
}
</style>
