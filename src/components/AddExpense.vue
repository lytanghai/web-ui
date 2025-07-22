<!-- src/components/AddExpense.vue -->
<template>
  <div>
    <h2>Add New Expense</h2>
    <form @submit.prevent="submitExpense">
      <label>Price:
        <input v-model.number="form.price" type="number" step="0.01" required />
      </label><br><br>

      <label>Currency:
        <select v-model="form.currency" required>
          <option value="USD">USD</option>
          <option value="KHR">KHR</option>
        </select>
      </label><br><br>

      <label>Category:
        <input v-model="form.category" type="text" required />
      </label><br><br>

      <label>Item:
        <input v-model="form.item" type="text" required />
      </label><br><br>

      <label>Note:
        <input v-model="form.note" type="text" />
      </label><br><br>

      <button type="submit">Submit</button>
    </form>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<style scoped>
.add-expense-container {
  max-width: 480px;
  margin: 2rem auto;
  padding: 1rem 1.5rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #34495e;
}

input,
select,
textarea {
  padding: 0.5rem 0.75rem;
  border: 1.5px solid #bdc3c7;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 5px #42b983aa;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

button {
  padding: 0.75rem 1rem;
  background-color: #42b983;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #369870;
}

.error {
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
}

/* Responsive for smaller devices (iOS phones etc.) */
@media (max-width: 480px) {
  .add-expense-container {
    margin: 1rem;
    padding: 1rem;
    width: auto;
  }

  input,
  select,
  textarea {
    font-size: 1.1rem;
  }

  button {
    font-size: 1.1rem;
  }
}
</style>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  price: 1.0,
  currency: 'USD',
  category: 'Drinks',
  item: 'Iced Americano',
  note: ''
})

const message = ref('')

const submitExpense = async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/expense_tracker/expense/create`,
      form.value
    )
    message.value = 'Expense added successfully!'
    // Optionally reset form
    form.value = {
      price: 0,
      currency: 'USD',
      category: '',
      item: '',
      note: ''
    }
  } catch (err) {
    console.error('Error:', err)
    message.value = 'Failed to add expense.'
  }
}
</script>
