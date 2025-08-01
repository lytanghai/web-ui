<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>📊 Planning Dashboard</h2>
      <button class="plan-btn create_plan" @click="select('create_plan')">📖 Create New Plan</button>
      <button class="plan-btn view_profit" @click="showViewPlan = true">💰 View Plans</button>
      <button class="cancel-btn" @click="$emit('close')">Cancel</button>
    </div>
    <CreatePlan v-if="showCreatePlan" @close="showCreatePlan = false" />
    <MyPlan v-if="showViewPlan" @close="showViewPlan = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CreatePlan from '../views/saving_plan/CreatePlan.vue'
import MyPlan from '../views/saving_plan/MyPlan.vue'

const emit = defineEmits(['close', 'select'])
const showCreatePlan = ref(false)
const showViewPlan = ref(false)

function select(type) {
  if (type === 'create_plan') {
    showCreatePlan.value = true
    selectedOption.value = null
  } else if (type === 'view_plan') {
    selectedOption.value = type
    showCreatePlan.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: #fff;
  border-radius: 16px;
  padding: 2rem;
  width: 320px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

h2 {
  margin-bottom: 1.5rem;
}

.plan-btn {
  display: block;
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s;
}

.plan-btn.create_plan {
  background-color: #1abc9c;
  color: #fff;
}

.plan-btn.view_profit {
  background-color: #f39c12;
  color: #fff;
}

.plan-btn:hover {
  opacity: 0.9;
}

.cancel-btn {
  margin-top: 1rem;
  background-color: #ccc;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
</style>
