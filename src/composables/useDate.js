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
  
  function getMonthCalendar(year, month) {
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    let startDay = firstDayOfMonth.getDay()
    startDay = startDay === 0 ? 6 : startDay - 1
    
    const days = []
    
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i)
      days.push({
        date: date,
        day: prevMonthLastDay - i,
        month: 'prev',
        dateStr: date.toISOString().split('T')[0],
        isToday: date.toDateString() === today.value.toDateString()
      })
    }
    
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({
        date: date,
        day: i,
        month: 'current',
        dateStr: date.toISOString().split('T')[0],
        isToday: date.toDateString() === today.value.toDateString()
      })
    }
    
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      days.push({
        date: date,
        day: i,
        month: 'next',
        dateStr: date.toISOString().split('T')[0],
        isToday: date.toDateString() === today.value.toDateString()
      })
    }
    
    return days
  }
  
  function formatDate(date, format = 'full') {
    const d = new Date(date)
    const day = d.getDate()
    const month = monthsGenitive[d.getMonth()]
    const year = d.getFullYear()
    const weekday = weekdays[d.getDay()]
    
    switch(format) {
      case 'full': return `${weekday}, ${day} ${month} ${year}`
      case 'date': return `${day} ${month} ${year}`
      case 'day-month': return `${day} ${month}`
      default: return `${day} ${month} ${year}`
    }
  }
  
  return {
    today,
    selectedDate,
    weekdaysShort,
    weekdays,
    months,
    getCarouselDays,
    getMonthCalendar, 
    formatDate
  }
}