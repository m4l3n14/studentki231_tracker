<script setup>
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHabits } from '../composables/useHabits'

const router = useRouter()
const { addHabit } = useHabits()
const showErrors = ref(false)
const todayDate = computed(()=> {return new Date().toISOString().split('T')[0]})
const form = reactive({
  type: 'habit',
  name: '',
  color: '#4CAF50',
  startDate: todayDate.value,
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
})

function validate() {
  const newErrors = {}
  
  if (!form.name.trim()) {
    newErrors.name = 'Название обязательно'
  } else if (form.name.length > 50) {
    newErrors.name = 'Название не может быть длиннее 50 символов'
  }
  
  if (!form.startDate) {
    newErrors.startDate = 'Дата начала обязательна'
  }
  
  if (!form.endDate) {
    newErrors.endDate = 'Дата окончания обязательна'
  }
  
  if (form.startDate && form.endDate) {
    const start = new Date(form.startDate)
    const end = new Date(form.endDate)
    const today = new Date(todayDate.value)
    
    if (start < today) {
      newErrors.startDate = 'Дата начала не может быть раньше сегодняшнего дня'
    }
    
    if (end < start) {
      newErrors.endDate = 'Дата окончания не может быть раньше даты начала'
    }
    
    const daysDiff = (end - start) / (1000 * 60 * 60 * 24)
    if (daysDiff > 365) {
      newErrors.endDate = 'Челлендж не может быть длиннее года'
    }
  }
  
  return newErrors
}

const errors = computed(() => validate())

function save() {
  showErrors.value = true
  
  if (Object.keys(errors.value).length > 0) {
    const firstError = document.querySelector('.error-message')
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }
  
  addHabit({
    name: form.name.trim(),
    type: form.type,
    color: form.color,
    startDate: form.startDate,
    endDate: form.endDate
  })
  
  router.push({ name: 'Tasks' })
}

function cancel() {
  router.back()
}
</script>
<template>
  <div class="add-task-container">
    <h1>Добавить новую</h1>
    
    <div class="form-group">
      <label>Тип</label>
      <div class="type-buttons">
        <button 
          type="button"
          class="type-btn"
          :class="{ active: form.type === 'habit' }"
          @click="form.type = 'habit'"
        >
          Привычка
        </button>
        <button 
          type="button"
          class="type-btn"
          :class="{ active: form.type === 'addiction' }"
          @click="form.type = 'addiction'"
        >
          Зависимость
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Название</label>
      <input 
        v-model="form.name" 
        type="text" 
        placeholder="Например: Не курить, Зарядка, Медитация..."
        class="form-input"
        :class="{ 'error': showErrors && errors.name }"
      >
      <span class="error-message" v-if="showErrors && errors.name">{{ errors.name }}</span>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Дата начала</label>
        <input 
          v-model="form.startDate" 
          type="date" 
          class="form-input"
          :class="{ 'error': showErrors && errors.startDate }"
          :min="todayDate"
        >
        <span class="error-message" v-if="showErrors && errors.startDate">{{ errors.startDate }}</span>
      </div>

      <div class="form-group">
        <label>Дата окончания</label>
        <input 
          v-model="form.endDate" 
          type="date" 
          class="form-input"
          :class="{ 'error': showErrors && errors.endDate }"
          :min="form.startDate || todayDate"
        >
        <span class="error-message" v-if="showErrors && errors.endDate">{{ errors.endDate }}</span>
      </div>
    </div>

    <div class="form-actions">
      <button @click="cancel" class="btn cancel">Отмена</button>
      <button @click="save" class="btn save">Сохранить</button>
    </div>
  </div>
</template>

<style scoped>
.add-task-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #7E884C;
}

.form-input.error {
  border-color: #f44336;
  background-color: #ffebee;
}

.error-message {
  display: block;
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
}

.type-buttons {
  display: flex;
  gap: 10px;
}

.type-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.type-btn.active {
  background: #7E884C;
  color: white;
  border-color: #7E884C;
}

.color-picker {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  border: 3px solid transparent;
}

.color-option.selected {
  border-color: #333;
  transform: scale(1.1);
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn.cancel {
  background: #f5f5f5;
  color: #666;
}

.btn.cancel:hover {
  background: #e0e0e0;
}

.btn.save {
  background: #7E884C;
  color: white;
}

.btn.save:hover {
  background: #6a7440;
}
</style>