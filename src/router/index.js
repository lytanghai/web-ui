import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import HomePage from '../components/HomePage.vue'
import Dashboard from '../components/Dashboard.vue'
import AddExpense from '../components/AddExpense.vue'  // import AddExpense

const routes = [
  { path: '/', name: 'Login', component: LoginForm },
  { path: '/home', name: 'Home', component: Dashboard },
  { path: '/add-expense', name: 'AddExpense', component: AddExpense }  // new route
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router