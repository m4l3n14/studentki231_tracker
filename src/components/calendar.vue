<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDate } from '../composables/useDate'
import { useHabits } from '../composables/useHabits'
import { useSelectedDate } from '../composables/useSelectedDate'

const router = useRouter()
const { getMonthCalendar, weekdaysShort, months } = useDate()
const { habits, loadData } = useHabits()
const { setSelectedDate } = useSelectedDate() 

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())

const calendarDays = computed(() => {
  return getMonthCalendar(currentYear.value, currentMonth.value)
})

function getDayHabits(dateStr) {
  const targetDate = new Date(dateStr)
  targetDate.setHours(0, 0, 0, 0)
  
  return habits.value.filter(habit => {
    const startDate = new Date(habit.startDate)
    startDate.setHours(0, 0, 0, 0)
    
    const endDate = new Date(habit.endDate)
    endDate.setHours(23, 59, 59, 999)
    
    return targetDate >= startDate && targetDate <= endDate
  })
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function goToTasks(date) {
  setSelectedDate(date)  
  router.push({ name: 'Tasks' })  
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="month-calendar">
    <div class="calendar-header">
      <button @click="prevMonth">‹</button>
      <h2>{{ months[currentMonth] }} {{ currentYear }}</h2>
      <button @click="nextMonth">›</button>
    </div>
    
    <div class="weekdays">
      <div v-for="day in weekdaysShort" :key="day">{{ day }}</div>
    </div>
    
    <div class="calendar-grid">
      <div 
        v-for="day in calendarDays" 
        :key="day.dateStr"
        class="calendar-day"
        :class="{
          'other-month': day.month !== 'current',
          'today': day.isToday
        }"
        @click="goToTasks(day.date)"
      >
        <div class="day-number">{{ day.day }}</div>
        <div class="habit-dots">
          <div 
            v-for="habit in getDayHabits(day.dateStr)"
            :key="habit.id"
            class="habit-dot"
            :class="habit.type"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2{
  color: #2B331B;

}
.month-calendar {
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 80%;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.calendar-header button {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background: white;
  border: none;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s;
  justify-content: center;
  align-items: center;
}

.calendar-header button:hover {
  background: #f0f0f0;
  transform: scale(1.01);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 10px 0;
  color: #2B331B;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  min-height: 80px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
  position: relative;
}

.calendar-day:hover {
  background: #ECEFC2;
  transform: scale(1.02);
}

.calendar-day.other-month {
  background: #f9f9f9;
  opacity: 0.5;
}

.calendar-day.today {
  background: #e8f5e9;
  border: 2px solid #7E884C;
}

.day-number {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #2B331B;
}

.habit-dots {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 5px;
}

.habit-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.habit-dot.habit {
  background-color: #4CAF50;
}

.habit-dot.addiction {
  background-color: #F44336;
}
</style>