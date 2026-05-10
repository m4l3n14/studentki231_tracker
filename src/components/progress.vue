<script setup>
import { computed, onMounted } from 'vue'
import { useHabits } from '../composables/useHabits'

const { habits, loadData } = useHabits()

const addictions = computed(() => {
    return habits.value.filter(item => item.type === 'addiction')
})

function getProgress(addiction) {
    const completedDays = Object.values(addiction.completed || {})
        .filter(Boolean).length

    const start = new Date(addiction.startDate)
    const end = new Date(addiction.endDate)

    const totalDays = Math.ceil(
        (end - start) / (1000 * 60 * 60 * 24)
    ) + 1

    const percent = totalDays > 0
        ? Math.round((completedDays / totalDays) * 100)
        : 0

    return {
        completedDays,
        totalDays,
        percent
    }
}

const overallProgress = computed(() => {
    if (addictions.value.length === 0) return 0

    const total = addictions.value.reduce((sum, addiction) => {
        return sum + getProgress(addiction).percent
    }, 0)

    return Math.round(total / addictions.value.length)
})

onMounted(() => {
    loadData()
})
</script>

<template>
    <div class="page">
        <h1>Прогресс</h1>

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
                Общий прогресс отказа от зависимостей
            </p>
        </div>

        <div class="progress-list">
            <div v-for="addiction in addictions" :key="addiction.id" class="progress-card">
                <div class="top">
                    <h2>{{ addiction.name }}</h2>

                    <span class="percent">
                        {{ getProgress(addiction).percent }}%
                    </span>
                </div>

                <div class="bar">
                    <div class="fill" :style="{ width: getProgress(addiction).percent + '%' }"></div>
                </div>

                <p class="stats">
                    Успешных дней:
                    {{ getProgress(addiction).completedDays }}
                    из
                    {{ getProgress(addiction).totalDays }}
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
    margin-bottom: 30px;
}

.main-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;
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
    transition: stroke-dasharray 0.5s ease;
}

.percentage {
    fill: #2B331B;
    font-size: 0.6em;
    text-anchor: middle;
    font-weight: bold;
}

.overall-text {
    margin-top: 20px;
    font-size: 18px;
    color: #444;
}

.progress-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.progress-card {
    background: #FEFAE0;
    border-radius: 18px;
    padding: 20px;
    border: 2px solid #7E884C;
}

.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

h2 {
    margin: 0;
    color: #2B331B;
}

.percent {
    font-size: 20px;
    font-weight: bold;
    color: #7E884C;
}

.bar {
    width: 100%;
    height: 16px;
    background: #ddd;
    border-radius: 20px;
    overflow: hidden;
}

.fill {
    height: 100%;
    background: #7E884C;
    transition: 0.4s;
}

.stats {
    margin-top: 12px;
    color: #555;
}
</style>