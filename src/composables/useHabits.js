import { ref, onMounted } from 'vue'

export function useHabits() {
  const habits = ref([])
  
  function loadData() {
    const saved = localStorage.getItem('habitTracker')
    if (saved) {
      habits.value = JSON.parse(saved)
    }
  }
  
  function saveData() {
    localStorage.setItem('habitTracker', JSON.stringify(habits.value))
  }
  
  function getHabitsForDate(date) {
    const dateStr = new Date(date).toISOString().split('T')[0]
    return habits.value.map(habit => ({
      ...habit,
      completed: habit.completed?.[dateStr] || false,
      isActive: date >= new Date(habit.startDate) && date <= new Date(habit.endDate)
    }))
  }
  
  function addHabit(habit) {
    habits.value.push({
      id: Date.now().toString(),
      completed: {},
      createdAt: new Date().toISOString(),
      ...habit
    })
    saveData()
  }
  
  function updateHabit(id, updatedData) {
    const index = habits.value.findIndex(h => h.id === id)
    if (index !== -1) {
      habits.value[index] = { ...habits.value[index], ...updatedData }
      saveData()
    }
  }
  
  function deleteHabit(id) {
    habits.value = habits.value.filter(h => h.id !== id)
    saveData()
  }
  
  function toggleHabit(habitId, date) {
    const habit = habits.value.find(h => h.id === habitId)
    if (habit) {
      const dateStr = new Date(date).toISOString().split('T')[0]
      if (!habit.completed) habit.completed = {}
      habit.completed[dateStr] = !habit.completed[dateStr]
      saveData()
    }
  }
  
  onMounted(() => {
    loadData()
  })
  
  return {
    habits,
    getHabitsForDate,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    loadData,
    saveData
  }
}