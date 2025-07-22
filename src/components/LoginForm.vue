<template>
    <div class="body">
        <div class="login-container">
            <h1>Sign in</h1>
            <form @submit.prevent="handleLogin">
                <div class="input-group">
                    <label for="username">Username</label>
                    <input v-model="username" type="text" id="username" name="username" required />
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input v-model="password" type="password" id="password" name="password" required />
                </div>
                <button type="submit">Login</button>
            </form>
            <p v-if="error" class="error-message">{{ error }}</p>
        </div>
        <LoadingSpinner :visible="loading" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
    error.value = ''
    loading.value = true

    const url_login = 'https://expense-tracker-istq.onrender.com/expense_tracker/public/auth/login'
    try {
        const response = await axios.post(url_login, {
            username: username.value,
            password: password.value
        })

        const token = response.data.token
        setTimeout(() => {
            loading.value = false
            localStorage.setItem('jwt_token', token)
            router.push('/home')
        }, 5000)


    } catch (err) {
        console.error("Login error", err)
        error.value = err.response?.data?.message || 'Login failed'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.body {
    font-family: "Comic Sans MS", sans-serif;
    background-color: #19202e;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    margin: 0;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
}

.login-container {
    background: white;
    border: 2px solid #000;
    padding: 40px;
    width: 320px;
    box-shadow: 10px 10px 0 #000;
    text-align: center;
}

h1 {
    font-size: 28px;
    margin-bottom: 30px;
}

.input-group {
    margin-bottom: 20px;
    text-align: left;
}

label {
    display: block;
    margin-bottom: 8px;
    font-size: 16px;
}

input {
    width: 90%;
    padding: 12px;
    border: 2px solid #000;
    box-shadow: 3px 3px 0 #000;
    font-size: 14px;
}

button {
    background-color: #ffcc00;
    border: 2px solid #000;
    padding: 12px;
    width: 100%;
    cursor: pointer;
    box-shadow: 3px 3px 0 #000;
    font-size: 16px;
}

button:hover {
    background-color: #ffeb3b;
}

.error-message {
    color: red;
    margin-top: 10px;
    font-weight: bold;
}

@media (max-width: 600px) {
    .login-container {
        width: 80%;
        padding: 30px;
    }
}
</style>
