<template>
  <div class="body">
    <div class="login-container">
      <h1>Sign in</h1>
      <form @submit.prevent="handleLogin">
        <LoadingSpinner v-if="loading" />

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

      <!-- Status popup -->
      <StatusModel
        :visible="showStatusModal"
        :title="statusTitle"
        :message="statusMessage"
        :status="statusType"
        closeText="Close"
        @close="showStatusModal = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import StatusModel from '../views/pop_up/StatusModel.vue'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Status popup state
const showStatusModal = ref(false)
const statusTitle = ref('')
const statusMessage = ref('')
const statusType = ref('success') // or 'failure'

// Function to open the status popup and auto-close after 2 seconds
function openStatusModal(type, title, message) {
  statusType.value = type
  statusTitle.value = title
  statusMessage.value = message
  showStatusModal.value = true
  setTimeout(() => {
    showStatusModal.value = false
  }, 2000)
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const response = await axios.post(import.meta.env.VITE_SERVER_WEB_URL + import.meta.env.VITE_LOGIN_URI, {
      username: username.value,
      password: password.value,
    })

  
    localStorage.setItem('jwt_token', response.data.token)
    localStorage.setItem('username', response.data.username)
    loading.value = false

    // Show success popup
    openStatusModal('success', 'Login Successful', 'You have been logged in.')

    // Navigate after popup disappears (delay 2 seconds)
    setTimeout(() => {
      router.push('/home')
    }, 2000)
  } catch (err) {
    console.error('Login error', err)
    error.value = err.response?.data?.message || 'Login failed'
    loading.value = false

    // Show failure popup
    openStatusModal('failure', 'Login Failed', error.value)
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
