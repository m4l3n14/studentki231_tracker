import { createRouter, createWebHashHistory } from 'vue-router'
import Tasks from './components/tasks.vue'
import Calendar from './components/calendar.vue'
import Myaddictions from './components/my_addictions.vue'
import Myhabits from './components/my_habits.vue'
import Progress from './components/progress.vue'
import Addtask from './components/add_task.vue'

const routes = [
    { path: '/', component: Tasks, name: 'Tasks'},
    { path: '/calendar', component: Calendar, name: 'Calendar'},
    { path: '/myaddicitons', component: Myaddictions, name: 'Myaddictions'},
    { path: '/myhabits', component: Myhabits, name: 'Myhabits'},
    { path: '/progress', component: Progress, name: 'Progress'},
    { path: '/addtask', component: Addtask, name: 'AddTask'}
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})