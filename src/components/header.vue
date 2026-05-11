<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isScrolled = ref(false)

window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 10
})

isScrolled.value = window.scrollY > 10
</script>

<template>
  <header class="header" :class="{ 'scrolled': isScrolled }">
    <div class="container">
        <div class="calendar">
          <router-link :to="{name: 'Calendar'}" class="header-link">
            <img src="/src/assets/img/calendar.svg" alt="calendar" class="header-img">
          </router-link>
        </div>
        
        <nav class="nav">
          <router-link :to="{name: 'Tasks'}" class="nav-item">Задачи</router-link>
          <router-link :to="{name: 'Myhabits'}" class="nav-item">Мои привычки</router-link>
          <router-link :to="{name: 'Myaddictions'}" class="nav-item">Мои зависимости</router-link>
          <router-link :to="{name: 'Progress'}" class="nav-item">Прогресс</router-link>
        </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.container {
  background-color: #7E884C;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 30px;
  align-items: center;
  margin: 0;
  gap: 30px;
  transition: all 0.3s ease;
}

.header.scrolled .container {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px 30px;
}

.header.scrolled .nav-item {
  color: #2B331B;
}

.header.scrolled .header-img {
  filter: brightness(0);
}

.header-img {
  width: 30px;
  transition: all 0.3s ease;
}

.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 40%;
  gap: 10px;
}

.nav-item {
  font-family: sans-serif;
  color: #FEFAE0;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.nav-item:hover {
  opacity: 0.8;
}
</style>