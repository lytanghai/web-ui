import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import Dashboard from '../components/Dashboard.vue'
import ExpenseReport from '../views/expense/ExpenseReport.vue'
import ProfitReport from '../views/profit/ProfitReport.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginForm },
  { path: '/home', name: 'Home', component: Dashboard },
  { path: '/expense-report', name: 'Expense Report', component: ExpenseReport },
  { path: '/profit-report', name: 'Profit Report', component: ProfitReport }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router