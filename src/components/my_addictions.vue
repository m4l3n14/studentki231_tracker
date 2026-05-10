<script setup>
import { computed, onMounted } from 'vue'
import { useHabits } from '../composables/useHabits'

const { habits, loadData } = useHabits()

const addictions = computed(() => {
  return habits.value.filter(item => item.type === 'addiction')
})

const todayStr = computed(() => {
  return new Date().toISOString().split('T')[0]
})

function isCompleted(addiction) {
  return addiction.completed?.[todayStr.value] || false
}

function toggle(addiction) {
  if (!addiction.completed) {
    addiction.completed = {}
  }

  addiction.completed[todayStr.value] =
    !addiction.completed[todayStr.value]

  localStorage.setItem(
    'habitTracker',
    JSON.stringify(habits.value)
  )
}

function remove(index) {
  addictions.value.splice(index, 1)

  localStorage.setItem(
    'habitTracker',
    JSON.stringify(habits.value)
  )
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="page">
    <h1>Мои зависимости</h1>

    <div v-if="addictions.length === 0" class="empty">
      <p>У вас пока нет зависимостей</p>
    </div>

    <div class="addictions-list">
      <div
        v-for="(addiction, index) in addictions"
        :key="index"
        class="card"
        :class="{ completed: isCompleted(addiction) }"
      >
        <div class="card-content">
          <div>
            <h2>{{ addiction.name }}</h2>

            <p class="date">
              {{ addiction.startDate }} — {{ addiction.endDate }}
            </p>
          </div>

          <div class="actions">
            <button
              class="done-btn"
              @click="toggle(addiction)"
            >
              {{ isCompleted(addiction) ? '✓' : '○' }}
            </button>

            <button
              class="delete-btn"
              @click="remove(index)"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="status">
          {{
            isCompleted(addiction)
              ? 'Сегодня удержались'
              : 'Отметьте успешный день'
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}

h1 {
  color: #2B331B;
  margin-bottom: 30px;
}

.empty {
  text-align: center;
  padding: 50px 0;
  color: #777;
}

.addictions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: #FEFAE0;
  border: 2px solid #7E884C;
  border-radius: 18px;
  padding: 20px;
  transition: 0.3s;
}

.card.completed {
  background: #7E884C;
  color: #FEFAE0;
}

.card-content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
}

h2 {
  margin: 0 0 10px;
  font-size: 22px;
}

.date {
  margin: 0;
  opacity: 0.8;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 10px;
}

.done-btn,
.delete-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 20px;
  transition: 0.3s;
}

.done-btn {
  background: #2B331B;
  color: white;
}

.delete-btn {
  background: #d9534f;
  color: white;
}

.done-btn:hover,
.delete-btn:hover {
  transform: scale(1.08);
}

.status {
  margin-top: 15px;
  font-size: 15px;
  font-weight: 500;
}
</style>