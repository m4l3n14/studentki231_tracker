<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useDate } from '../composables/useDate'

const props = defineProps({
  modelValue: { type: Date, default: () => new Date() },
  range: { type: Number, default: 3 },
  showMonth: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'daySelect'])

const { getCarouselDays, formatDate } = useDate()

const trackRef = ref(null)
const dayRefs = ref([])
const visibleDays = ref([])
const selectedDateStr = ref('')
const currentCenter = ref(new Date())

function updateDays() {
  visibleDays.value = getCarouselDays(currentCenter.value, props.range)
  selectedDateStr.value = props.modelValue ? 
    new Date(props.modelValue).toISOString().split('T')[0] : ''
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
  emit('update:modelValue', date)
  emit('daySelect', date)
  selectedDateStr.value = date.toISOString().split('T')[0]
}

watch(() => props.modelValue, (newDate) => {
  if (newDate) {
    selectedDateStr.value = new Date(newDate).toISOString().split('T')[0]
    currentCenter.value = new Date(newDate)
    updateDays()
    scrollToCenter()
  }
})

onMounted(() => {
  updateDays()
  scrollToCenter()
})
</script>

<template>
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
</template>

<style scoped>
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
</style>