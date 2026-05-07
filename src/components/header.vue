<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isScrolled = ref(false)

window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50
})

isScrolled.value = window.scrollY > 50

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
        
        <div class="header-actions">
            <div class="NewTask">
                <router-link :to="{name: 'AddTask'}" class="header-link">
                    <img src="/src/assets/img/plus.svg" alt="plus" class="header-img">
                </router-link>
            </div>
        </div>
      </div>
  </header>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%; 
}
.container{
    background-color: #7E884C;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 30px;
    align-items: center;
    margin: 0;
}

.header-img{
    width: 30px;
}

.nav{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 40%;
}

.nav-item{
    font-family: sans-serif;
    color: #ECEFC2;
    text-decoration: none;
}

</style>