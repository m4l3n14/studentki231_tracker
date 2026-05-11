<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHabits } from '../composables/useHabits'

const router = useRouter()
const { habits, loadData, updateHabit, deleteHabit, saveData } = useHabits()

const editingId = ref(null)
const editForm = ref({
  name: '',
  startDate: '',
  endDate: ''
})

const deleteConfirmId = ref(null)
const editError = ref('')

const todayStr = computed(() => {
    return new Date().toISOString().split('T')[0]
})

const onlyHabits = computed(() => {
  return habits.value.filter(item => item.type === 'habit')
})

const habitsCount = computed(() => onlyHabits.value.length)

const habitsWord = computed(() => {
  const count = habitsCount.value
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'привычек'
  if (lastDigit === 1) return 'привычка'
  if (lastDigit >= 2 && lastDigit <= 4) return 'привычки'
  return 'привычек'
})

function startEdit(habit) {
  editingId.value = habit.id
  editForm.value = {
    name: habit.name,
    startDate: habit.startDate,
    endDate: habit.endDate
  }
  editError.value = ''
}

function cancelEdit() {
  editingId.value = null
  editForm.value = {
    name: '',
    startDate: '',
    endDate: ''
  }
  editError.value = ''
}

function saveEdit(habitId) {
  editError.value = ''

  if (!editForm.value.name.trim()) {
    editError.value = 'Введите название привычки'
    return
  }
  
  const startDate = new Date(editForm.value.startDate)
  const endDate = new Date(editForm.value.endDate)
  
  if (endDate < startDate) {
    editError.value = 'Дата окончания не может быть раньше даты начала'
    return
  }
  
  updateHabit(habitId, {
    name: editForm.value.name.trim(),
    startDate: editForm.value.startDate,
    endDate: editForm.value.endDate
  })
  
  cancelEdit()
}

function confirmDelete(habitId) {
  deleteConfirmId.value = habitId
}

function cancelDelete() {
  deleteConfirmId.value = null
}

function executeDelete(habitId) {
  deleteHabit(habitId)
  deleteConfirmId.value = null

  if (editingId.value === habitId) {
    cancelEdit()
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function isCompleted(habit) {
    return habit.completed?.[todayStr.value] || false
}

function toggleDay(habit) {
    if (!habit.completed) {
        habit.completed = {}
    }
    
    habit.completed[todayStr.value] = !habit.completed[todayStr.value]
    saveData()
}

function daysLeft(endDateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(endDateStr)
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
  return diff
}

function daysLeftText(endDateStr) {
  const days = daysLeft(endDateStr)
  if (days < 0) return 'Завершена'
  if (days === 0) return 'Заканчивается сегодня'
  
  const lastDigit = days % 10
  const lastTwoDigits = days % 100
  
  let word = 'дней'
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    word = 'дней'
  } else if (lastDigit === 1) {
    word = 'день'
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    word = 'дня'
  }
  
  return `Осталось ${days} ${word}`
}

function goToAddTask() {
  router.push({ name: 'AddTask' })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="my-habits-page">
    <div class="page-header">
      <h1 class="page-title">Мои привычки</h1>
      <div class="habits-count">
        <span class="count-number">{{ habitsCount }}</span>
        <span class="count-label">{{ habitsWord }}</span>
      </div>
    </div>

    <div class="habits-list" v-if="onlyHabits.length > 0">
      <div v-for="habit in onlyHabits" 
        :key="habit.id" 
        class="habit-card"
        :class="{ 'editing': editingId === habit.id, 'completed': isCompleted(habit)}">

        <div v-if="editingId !== habit.id" class="habit-view">
          <div class="habit-info">
            <div class="habit-header">
              <h3 class="habit-name">{{ habit.name }}</h3>
              <div class="habit-days-badge" :class="{ 'ending-soon': daysLeft(habit.endDate) <= 3 && daysLeft(habit.endDate) >= 0 }">
                {{ daysLeftText(habit.endDate) }}
              </div>
            </div>
            
            <div class="habit-dates">
              <div class="date-item">
                <span class="date-label">Начало:</span>
                <span class="date-value">{{ formatDate(habit.startDate) }}</span>
              </div>
              <div class="date-item">
                <span class="date-label">Окончание:</span>
                <span class="date-value">{{ formatDate(habit.endDate) }}</span>
              </div>
            </div>
            <div class="status-text">
              {{ isCompleted(habit) ? 'Сегодня выполнено' : 'Отметьте успешный день' }}
            </div>
          </div>
          
          <div class="habit-actions">
            <button @click="toggleDay(habit)" class="action-btn check-btn"
              :title="isCompleted(habit) ? 'Снять отметку' : 'Отметить день'">
              {{ isCompleted(habit) ? '✓' : '○' }}
            </button>

            
            <button @click="startEdit(habit)" class="action-btn edit-btn" title="Редактировать">
              ✎
            </button>
            <button 
              v-if="deleteConfirmId !== habit.id" 
              @click="confirmDelete(habit.id)" 
              class="action-btn delete-btn" 
              title="Удалить"
            >
              ✕
            </button>

            <div v-else class="delete-confirm">
              <span class="confirm-text">Удалить?</span>
              <button @click="executeDelete(habit.id)" class="confirm-yes">Да</button>
              <button @click="cancelDelete" class="confirm-no">Нет</button>
            </div>
          </div>
        </div>

        <div v-else class="habit-edit">
          <div class="edit-field">
            <label>Название</label>
            <input 
              v-model="editForm.name" 
              type="text" 
              class="edit-input"
              placeholder="Название привычки"
            >
          </div>
          
          <div class="edit-dates">
            <div class="edit-field">
              <label>Дата начала</label>
              <input 
                v-model="editForm.startDate" 
                type="date" 
                class="edit-input"
              >
            </div>
            
            <div class="edit-field">
              <label>Дата окончания</label>
              <input 
                v-model="editForm.endDate" 
                type="date" 
                class="edit-input"
                :min="editForm.startDate"
              >
            </div>
          </div>
          <span v-if="editError" class="edit-error"> {{ editError }} </span>
          <div class="edit-actions">
            <button @click="saveEdit(habit.id)" class="save-edit-btn">Сохранить</button>
            <button @click="cancelEdit" class="cancel-edit-btn">Отмена</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">🌱</div>
      <h2 class="empty-title">У вас пока нет привычек</h2>
      <p class="empty-text">Добавьте свою первую привычку и начните отслеживать прогресс</p>
      <button @click="goToAddTask" class="add-first-btn">
        + Добавить привычку
      </button>
    </div>

  </div>
</template>

<style scoped>
.my-habits-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 20px 100px;
  font-family: sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  color: #2B331B;
  margin: 0;
}

.habits-count {
  display: flex;
  align-items: baseline;
  gap: 8px;
  background: #ECEFC2;
  padding: 10px 16px;
  border-radius: 12px;
}

.count-number {
  font-size: 28px;
  font-weight: bold;
  color: #2B331B;
}

.count-label {
  font-size: 16px;
  color: #555;
}

.habit-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.habit-card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.habit-card.editing {
  border-color: #7E884C;
  box-shadow: 0 4px 15px rgba(126, 136, 76, 0.15);
}

.habit-view {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
}

.habit-info {
  flex: 1;
}

.habit-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.habit-name {
  font-size: 20px;
  color: #2B331B;
  margin: 0;
  font-weight: 600;
}

.habit-days-badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  background: #e8f5e9;
  color: #2e7d32;
  white-space: nowrap;
  font-weight: 500;
}

.habit-days-badge.ending-soon {
  background: #fff3e0;
  color: #e65100;
}

.habit-dates {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.date-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-label {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-value {
  font-size: 14px;
  color: #555;
}

.habit-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.edit-btn {
  background: #f0f4e1;
  color: #7E884C;
}

.edit-btn:hover {
  background: #7E884C;
  color: white;
}

.delete-btn {
  background: #ffebee;
  color: #c62828;
}

.delete-btn:hover {
  background: #c62828;
  color: white;
}

.delete-confirm {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid #ffcdd2;
}

.confirm-text {
  font-size: 13px;
  color: #c62828;
  font-weight: 500;
}

.confirm-yes,
.confirm-no {
  padding: 4px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;
}

.confirm-yes {
  background: #c62828;
  color: white;
}

.confirm-yes:hover {
  background: #b71c1c;
}

.confirm-no {
  background: #eee;
  color: #555;
}

.confirm-no:hover {
  background: #ddd;
}

.habit-edit {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.edit-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.edit-field label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.edit-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.edit-input:focus {
  outline: none;
  border-color: #7E884C;
}

.edit-dates {
  display: flex;
  gap: 15px;
}

.edit-dates .edit-field {
  flex: 1;
}

.edit-actions {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.save-edit-btn,
.cancel-edit-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.save-edit-btn {
  background: #7E884C;
  color: white;
}

.save-edit-btn:hover {
  background: #6a7440;
}

.cancel-edit-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-edit-btn:hover {
  background: #e0e0e0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 22px;
  color: #2B331B;
  margin: 0 0 10px;
}

.empty-text {
  font-size: 16px;
  color: #888;
  margin: 0 0 30px;
}

.add-first-btn {
  padding: 14px 28px;
  background: #7E884C;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.add-first-btn:hover {
  background: #6a7440;
  transform: scale(1.03);
}

.check-btn {
    background: #f0f4e1;
    color: #7E884C;
}

.check-btn:hover {
    background: #7E884C;
    color: white;
}

.status-text {
    margin-top: 14px;
    font-size: 14px;
    color: #666;
    font-weight: 500;
}

.habit-card.completed {
    border-color: #7E884C;
    box-shadow: 0 4px 15px rgba(126, 136, 76, 0.12);
}
.edit-error {
    font-size: 14px;
    color: #c62828;
    font-weight: 500;
    margin-top: -4px;
}
</style>