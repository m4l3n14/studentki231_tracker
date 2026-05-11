<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isAddTaskPage = computed(() => {
  return route.name === 'AddTask'
})

function goToAddTask() {
  router.push({ name: 'AddTask' })
}
</script>

<template>
  <button v-if="!isAddTaskPage" class="float-btn" @click="goToAddTask">
    +
  </button>
</template>

<style scoped>
.float-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #7E884C;
  color: white;
  border: none;
  font-size: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}

.float-btn:hover {
  background-color: #6a7440;
  transform: scale(1.02);
}

.float-btn:active {
  transform: scale(0.95);
}
</style>