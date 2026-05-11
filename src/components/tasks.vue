<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDate } from '../composables/useDate'
import { useHabits } from '../composables/useHabits'
import { useSelectedDate } from '../composables/useSelectedDate'

const router = useRouter()
const route = useRoute()
const { habits, loadData, toggleHabit } = useHabits()
const { getCarouselDays, formatDate } = useDate()
const { selectedDate, setSelectedDate } = useSelectedDate()  

const trackRef = ref(null)
const dayRefs = ref([])
const visibleDays = ref([])
const selectedDateStr = ref('')
const currentCenter = ref(new Date())

const props = defineProps({
  range: { type: Number, default: 3 },
  showMonth: { type: Boolean, default: false }
})

function updateDays() {
  visibleDays.value = getCarouselDays(currentCenter.value, props.range)
  selectedDateStr.value = selectedDate.value.toISOString().split('T')[0]
}

function setDayRef(el, index) {
  if (el) {
    dayRefs.value[index] = el
  }
}

function scrollToCenter() {
  nextTick(() => {
    if (trackRef.value && dayRefs.value[props.range]) {
      const container = trackRef.value
      const centerDay = dayRefs.value[props.range]
      
      if (centerDay) {
        const scrollPosition = centerDay.offsetLeft - 
          (container.offsetWidth / 2) + 
          (centerDay.offsetWidth / 2)
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        })
      }
    }
  })
}

function scrollPrev() {
  currentCenter.value = new Date(currentCenter.value)
  currentCenter.value.setDate(currentCenter.value.getDate() - 1)
  updateDays()
  
  nextTick(() => {
    if (trackRef.value) {
      trackRef.value.scrollLeft -= 150
    }
  })
}

function scrollNext() {
  currentCenter.value = new Date(currentCenter.value)
  currentCenter.value.setDate(currentCenter.value.getDate() + 1)
  updateDays()
  
  nextTick(() => {
    if (trackRef.value) {
      trackRef.value.scrollLeft += 150
    }
  })
}

function selectDay(date) {
  setSelectedDate(date) 
  selectedDateStr.value = date.toISOString().split('T')[0]
}

watch(selectedDate, (newDate) => {
  if (newDate) {
    selectedDateStr.value = newDate.toISOString().split('T')[0]
    currentCenter.value = new Date(newDate)
    updateDays()
    scrollToCenter()
  }
}, { immediate: true })

const activeDateStr = computed(() => {
  return selectedDate.value.toISOString().split('T')[0]
})

const todayStr = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const canToggle = computed(() => {
  return activeDateStr.value <= todayStr.value
})

const tasksTitle = computed(() => {
  const selected = selectedDate.value
  const today = new Date()
  if (selected.toDateString() === today.toDateString()) {
    return 'Задачи на сегодня:'
  }
  
  const options = { day: 'numeric', month: 'long' }
  const formattedDate = selected.toLocaleDateString('ru-RU', options)
  
  return `Задачи на ${formattedDate}:`
})

const activeTasks = computed(() => {
  const checkDate = new Date(selectedDate.value)
  checkDate.setHours(0, 0, 0, 0)
  
  return habits.value
    .filter(item => {
      const startDate = new Date(item.startDate)
      startDate.setHours(0, 0, 0, 0)
      
      const endDate = new Date(item.endDate)
      endDate.setHours(23, 59, 59, 999)
      
      return checkDate >= startDate && checkDate <= endDate
    })
    .map(item => {
      const dateStr = activeDateStr.value
      return {
        ...item,
        taskType: item.type,
        completed: item.completed?.[dateStr] || false
      }
    })
})

const progressPercent = computed(() => {
  if (activeTasks.value.length === 0) return 0
  const completedCount = activeTasks.value.filter(task => task.completed).length
  return Math.round((completedCount / activeTasks.value.length) * 100)
})

function toggleTask(task) {
  if (!canToggle.value) return
  toggleHabit(task.id, selectedDate.value)
}

function goToAddTask() {
  router.push({ name: 'AddTask' })
}

const isFutureDate = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const selected = new Date(selectedDate.value)
  selected.setHours(0, 0, 0, 0)
  return selected > today
})

onMounted(() => {
  loadData()
  updateDays()
  scrollToCenter()
  
  if (route.query.date) {
    const dateFromCalendar = new Date(route.query.date)
    setSelectedDate(dateFromCalendar)
    currentCenter.value = dateFromCalendar
    updateDays()
    scrollToCenter()
  }
})
</script>

<template>
  <div class="tasks-page">
    <div class="carousel">
        <div class="carousel-container">
            <button class="carousel-btn prev" @click="scrollPrev">‹</button>
            
            <div class="carousel-track" ref="trackRef">
            <div 
                v-for="(day, index) in visibleDays" 
                :key="day.dateStr"
                :ref="el => setDayRef(el, index)"
                class="carousel-day"
                :class="{ 
                'today': day.isToday,
                'selected': selectedDateStr === day.dateStr
                }"
                @click="selectDay(day.date)"
            >
                <div class="day-number">{{ day.day }}</div>
                <div class="weekday">{{ day.weekday }}</div>
                <div class="month" v-if="showMonth">{{ day.month }}</div>
            </div>
            </div>
            
            <button class="carousel-btn next" @click="scrollNext">›</button>
        </div>
    </div>

    <div class="tasks-header">
      <h2 class="tasks-subtitle">{{ tasksTitle }}</h2>
    </div>

    <div class="progress-container">
      <div class="progress-circle">
        <svg viewBox="0 0 36 36" class="circular-chart">
          <path class="circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path class="circle"
            :stroke-dasharray="`${progressPercent}, 100`"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" class="percentage">{{ progressPercent }}%</text>
        </svg>
      </div>
    </div>

    <div v-if="isFutureDate && activeTasks.length > 0" class="future-notice">
      Это будущая дата. Отметьте свои выполнения в этот день
    </div>

    <div class="tasks-list">
      <div v-if="activeTasks.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <p class="empty-text">На эту дату нет активных задач</p>
        <p class="empty-hint">
          <template v-if="isFutureDate">
            Задачи появятся здесь, когда наступит эта дата
          </template>
          <template v-else>
            Добавьте новую привычку или зависимость
          </template>
        </p>
        <button @click="goToAddTask" class="add-button">+</button>
      </div>
      
      <div 
        v-for="task in activeTasks" 
        :key="task.id" 
        class="task-item"
        :class="{ 
          'completed': task.completed,
          'future': isFutureDate
        }"
        @click="toggleTask(task)"
      >
        <div class="task-left">
          <span class="task-type-badge" :class="task.taskType">
            {{ task.taskType === 'habit' ? 'Привычка' : 'Зависимость' }}
          </span>
          <span class="task-name">{{ task.name }}</span>
        </div>
        <span class="task-checkmark">{{ task.completed ? '✓' : '' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tasks-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}

.tasks-header {
  margin: 30px 0 10px;
}

.tasks-subtitle {
  font-size: 24px;
  color: #2B331B;
  margin: 0;
}

.progress-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0 30px;
}

.progress-circle {
  width: 200px;
  height: 200px;
}

.circular-chart {
  display: block;
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3;
}

.circle {
  fill: none;
  stroke-width: 4;
  stroke: #7E884C;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease;
}

.percentage {
  fill: #2B331B;
  font-size: 0.45em;
  text-anchor: middle;
  font-weight: bold;
}

.future-notice {
  text-align: center;
  padding: 10px 15px;
  margin-bottom: 15px;
  background: #b4c176;
  border: 1px solid #7E884C;
  border-radius: 10px;
  color: #52573a;
  font-size: 14px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 18px;
  color: #52573a;
}

.task-item:hover {
  background: #f9f9f9;
}

.task-item.future {
  cursor: default;
  opacity: 0.7;
}

.task-item.future:hover {
  background: white;
}

.task-item.completed {
  background: #2d4c1e;
  border-color: #2d4c1e;
  color: white;
}

.task-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-type-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
  white-space: nowrap;
}

.task-type-badge.habit {
  background: #e8f5e9;
  color: #2e7d32;
}

.task-type-badge.addiction {
  background: #fce4ec;
  color: #c62828;
}

.task-item.completed .task-type-badge.habit {
  background: #1b5e20;
  color: #a5d6a7;
}

.task-item.completed .task-type-badge.addiction {
  background: #b71c1c;
  color: #ef9a9a;
}

.task-name {
  font-weight: 500;
}

.task-checkmark {
  font-size: 20px;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 18px;
  margin: 0 0 8px;
  color: #444;
}

.empty-hint {
  font-size: 14px;
  color: #999;
  margin: 0 0 20px;
}

.add-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #7E884C;
  color: white;
  font-size: 28px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto 0;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.carousel{
    display: flex;
    justify-content: center;
}

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 30px;
  background: white;
  padding: 15px 0;
}

.carousel-track {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 10px;
  padding: 10px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-day {
  flex-shrink: 0;
  width: 75px;
  padding: 12px;
  text-align: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.carousel-day:hover {
  background: rgba(0, 0, 0, 0.05);
}

.carousel-day.today {
  background: #a8bc45;
}

.carousel-day.selected {
  background: #7E884C;
  transform: scale(1.01);
}

.weekday {
  font-size: 15px;
  margin: 5px 0;
  color: #2B331B;
  font-weight: bold;
}

.day-number {
  font-size: 24px;
  font-weight: bold;
  padding: 10px;
  border-radius: 100%;
  color: #2B331B;
  border: solid 1px #2B331B;
  background-color: #ECEFC2;
}

.month {
  font-size: 10px;
  margin-top: 5px;
  opacity: 0.7;
}

.carousel-btn {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background: white;
  border: none;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s;
}

.carousel-btn:hover {
  background: #f0f0f0;
  transform: scale(1.01);
}

@media (max-width: 600px) {
  .carousel-container {
    gap: 4px;
  }
  
  .carousel-day {
    width: 55px;
    padding: 5px 3px;
  }
  
  .weekday {
    font-size: 11px;
  }
  
  .day-number {
    font-size: 18px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin: 0 auto;
  }
  
  .carousel-btn {
    width: 30px;
    height: 30px;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .carousel-track {
    flex-direction: column;
    align-items: center;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .carousel-day {
    width: 80px;
  }
  
  .carousel-btn {
    display: none;
  }
}
</style>