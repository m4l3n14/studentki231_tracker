<script setup>
import Header from './components/header.vue'
import Footer from './components/footer.vue'
import FloatButton from './components/float_button.vue'
</script>

<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <FloatButton />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  font-family: sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>