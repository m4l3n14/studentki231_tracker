<script setup>
import { computed, onMounted, ref } from 'vue'
import { useHabits } from '../composables/useHabits'

const { habits, loadData } = useHabits()

const activeTab = ref('addictions') //вкладка прогресса зависимости/привычки. по умолчанию зависимости

const filteredItems = computed(() => {
    return habits.value.filter(item => item.type === activeTab.value.slice(0, -1))
})

function getProgress(item) {
    const completedDays = Object.values(item.completed || {})
        .filter(Boolean).length

    const start = new Date(item.startDate)
    const end = new Date(item.endDate)

    const totalDays = Math.ceil(
        (end - start) / (1000 * 60 * 60 * 24)
    ) + 1

    const percent = totalDays > 0
        ? Math.round((completedDays / totalDays) * 100)
        : 0

    return { completedDays, totalDays, percent }
}

const overallProgress = computed(() => {
    if (filteredItems.value.length === 0) return 0

    const total = filteredItems.value.reduce((sum, item) => {
        return sum + getProgress(item).percent
    }, 0)

    return Math.round(total / filteredItems.value.length)
})

onMounted(() => {
    loadData()
})
</script>

<template>
    <div class="page">
        <h1>Прогресс</h1>

        <!-- Табы -->
        <div class="tabs">
            <button :class="{ active: activeTab === 'addictions' }" @click="activeTab = 'addictions'">
                Зависимости
            </button>

            <button :class="{ active: activeTab === 'habits' }" @click="activeTab = 'habits'">
                Привычки
            </button>
        </div>

        <div class="main-progress">
            <div class="circle">
                <svg viewBox="0 0 36 36">
                    <path class="bg" d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831" />

                    <path class="progress" :stroke-dasharray="`${overallProgress}, 100`" d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831" />

                    <text x="18" y="20.35" class="percentage">
                        {{ overallProgress }}%
                    </text>
                </svg>
            </div>

            <p class="overall-text">
                Общий прогресс {{ activeTab === 'addictions'
                    ? 'отказа от зависимостей'
                    : 'развития привычек' }}
            </p>
        </div>

        <div class="progress-list">
            <div v-for="item in filteredItems" :key="item.id" class="progress-card">
                <div class="top">
                    <h2>{{ item.name }}</h2>

                    <span class="percent">
                        {{ getProgress(item).percent }}%
                    </span>
                </div>

                <div class="bar">
                    <div class="fill" :style="{ width: getProgress(item).percent + '%' }"></div>
                </div>

                <p class="stats">
                    Успешных дней:
                    {{ getProgress(item).completedDays }}
                    из
                    {{ getProgress(item).totalDays }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page {
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
    font-family: sans-serif;
}

h1 {
    color: #2B331B;
    margin-bottom: 20px;
}

.tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 25px;
}

.tabs button {
    flex: 1;
    padding: 10px;
    border: 2px solid #7E884C;
    background: white;
    cursor: pointer;
    border-radius: 10px;
    transition: 0.3s;
}

.tabs button.active {
    background: #7E884C;
    color: white;
}

.main-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
}

.circle {
    width: 220px;
    height: 220px;
}

svg {
    width: 100%;
    height: 100%;
}

.bg {
    fill: none;
    stroke: #e6e6e6;
    stroke-width: 3.5;
}

.progress {
    fill: none;
    stroke: #7E884C;
    stroke-width: 4;
    stroke-linecap: round;
    transition: 0.4s;
}

.percentage {
    fill: #2B331B;
    font-size: 0.6em;
    text-anchor: middle;
    font-weight: bold;
}

.overall-text {
    margin-top: 15px;
    font-size: 16px;
    color: #444;
}

.progress-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.progress-card {
    background: #FEFAE0;
    border-radius: 16px;
    padding: 18px;
    border: 2px solid #7E884C;
}

.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

h2 {
    margin: 0;
    color: #2B331B;
}

.percent {
    font-weight: bold;
    color: #7E884C;
}

.bar {
    height: 14px;
    background: #ddd;
    border-radius: 20px;
    overflow: hidden;
    margin-top: 10px;
}

.fill {
    height: 100%;
    background: #7E884C;
    transition: 0.4s;
}

.stats {
    margin-top: 10px;
    font-size: 14px;
    color: #555;
}
</style>