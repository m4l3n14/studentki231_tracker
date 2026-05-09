import { ref, computed } from 'vue'

export function useDate() {
  const today = ref(new Date())
  const selectedDate = ref(new Date())
  
  const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  
  const monthsGenitive = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
    'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
  
  const weekdays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда',
    'Четверг', 'Пятница', 'Суббота']
  
  const weekdaysShort = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  
  function getCarouselDays(centerDate = today.value, range = 3) {
    const days = []
    const center = new Date(centerDate)
    
    for (let i = -range; i <= range; i++) {
      const date = new Date(center)
      date.setDate(center.getDate() + i)
      
      days.push({
        date: date,
        day: date.getDate(),
        weekday: weekdaysShort[date.getDay()],
        weekdayFull: weekdays[date.getDay()],
        month: months[date.getMonth()],
        isToday: date.toDateString() === today.value.toDateString(),
        dateStr: date.toISOString().split('T')[0]
      })
    }
    
    return days
  }
  
  
  return {
    today,
    selectedDate,
    weekdaysShort,
    weekdays,
    months,
    getCarouselDays
  }
}