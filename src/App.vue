<script setup>
import Header from './components/header.vue'
</script>

<template>
  <div class="app">
    <Header />
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.app {
  min-height: 100vh;
}
</style>