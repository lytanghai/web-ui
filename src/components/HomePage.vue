<!-- <template>
  <div>
    <h1>Welcome Home!</h1>
    <p>You are logged in.</p>
  </div>
</template>

<script setup>
// Any logic for HomePage here
</script> -->

<template>
  <div class="home-container">
    <h1>Welcome, {{ username }}!</h1>
    <p>You are logged in.</p>

    <div class="actions">
      <button @click="goTo('/add-expense')">Add Expense</button>
      <button @click="goTo('/get-expense')">Get Expense</button>
      <button @click="goTo('/list-expense')">List Expense</button>
      <button @click="goTo('/trigger-message')">Trigger Message</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')

onMounted(() => {
  // For demo: get username from localStorage or fallback
  username.value = localStorage.getItem('username') || 'User'
})

function goTo(path) {
  router.push(path)
}
</script>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  padding: 0.75rem 1.2rem;
  border: none;
  border-radius: 6px;
  background-color: #42b983;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #369870;
}
</style>
