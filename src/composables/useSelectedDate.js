import { ref } from 'vue'

const selectedDate = ref(new Date())

export function useSelectedDate() {
  function setSelectedDate(date) {
    selectedDate.value = date
  }

  return {
    selectedDate,
    setSelectedDate
  }
}