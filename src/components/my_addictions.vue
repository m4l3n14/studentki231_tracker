<script setup>
import { computed, onMounted } from 'vue'
import { useHabits } from '../composables/useHabits'

const { habits, loadData, saveData } = useHabits()

const onlyAddictions = computed(() => {
    return habits.value.filter(item => item.type === 'addiction')
})

const addictionsCount = computed(() => onlyAddictions.value.length)

const addictionsWord = computed(() => {
    const count = addictionsCount.value
    const lastDigit = count % 10
    const lastTwoDigits = count % 100

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'зависимостей'
    if (lastDigit === 1) return 'зависимость'
    if (lastDigit >= 2 && lastDigit <= 4) return 'зависимости'
    return 'зависимостей'
})

const todayStr = computed(() => {
    return new Date().toISOString().split('T')[0]
})

function isCompleted(addiction) {
    return addiction.completed?.[todayStr.value] || false
}

function toggle(addiction) {
    if (!addiction.completed) {
        addiction.completed = {}
    }

    addiction.completed[todayStr.value] = !addiction.completed[todayStr.value]
    saveData()
}

function confirmDelete(addiction) {
    const index = habits.value.indexOf(addiction)
    if (index !== -1) {
        habits.value.splice(index, 1)
        saveData()
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '—'

    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

function daysLeft(endDateStr) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const end = new Date(endDateStr)
    end.setHours(0, 0, 0, 0)

    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
    return diff
}

function daysLeftText(endDateStr) {
    const days = daysLeft(endDateStr)

    if (days < 0) return 'Завершена'
    if (days === 0) return 'Заканчивается сегодня'

    const lastDigit = days % 10
    const lastTwoDigits = days % 100

    let word = 'дней'
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        word = 'дней'
    } else if (lastDigit === 1) {
        word = 'день'
    } else if (lastDigit >= 2 && lastDigit <= 4) {
        word = 'дня'
    }

    return `Осталось ${days} ${word}`
}

onMounted(() => {
    loadData()
})
</script>

<template>
    <div class="my-addictions-page">
        <div class="page-header">
            <h1 class="page-title">Мои зависимости</h1>
            <div class="addictions-count">
                <span class="count-number">{{ addictionsCount }}</span>
                <span class="count-label">{{ addictionsWord }}</span>
            </div>
        </div>

        <div class="addictions-list" v-if="onlyAddictions.length > 0">
            <div v-for="addiction in onlyAddictions" :key="addiction.id" class="addiction-card"
                :class="{ 'completed': isCompleted(addiction) }">
                <div class="addiction-view">
                    <div class="addiction-info">
                        <div class="addiction-header">
                            <h3 class="addiction-name">{{ addiction.name }}</h3>
                            <div class="addiction-days-badge"
                                :class="{ 'ending-soon': daysLeft(addiction.endDate) <= 3 && daysLeft(addiction.endDate) >= 0 }">
                                {{ daysLeftText(addiction.endDate) }}
                            </div>
                        </div>

                        <div class="addiction-dates">
                            <div class="date-item">
                                <span class="date-label">Начало:</span>
                                <span class="date-value">{{ formatDate(addiction.startDate) }}</span>
                            </div>
                            <div class="date-item">
                                <span class="date-label">Окончание:</span>
                                <span class="date-value">{{ formatDate(addiction.endDate) }}</span>
                            </div>
                        </div>

                        <div class="status-text">
                            {{
                                isCompleted(addiction)
                                    ? 'Сегодня удержались'
                                    : 'Отметьте успешный день'
                            }}
                        </div>
                    </div>

                    <div class="addiction-actions">
                        <button @click="toggle(addiction)" class="action-btn check-btn"
                            :title="isCompleted(addiction) ? 'Снять отметку' : 'Отметить день'">
                            {{ isCompleted(addiction) ? '✓' : '○' }}
                        </button>

                        <button @click="confirmDelete(addiction)" class="action-btn delete-btn" title="Удалить">
                            ✕
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="empty-state">
            <div class="empty-icon">🌿</div>
            <h2 class="empty-title">У вас пока нет зависимостей</h2>
            <p class="empty-text">Добавьте первую зависимость и начните отслеживать отказ от неё</p>
        </div>
    </div>
</template>

<style scoped>
.my-addictions-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 20px 100px;
    font-family: sans-serif;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.page-title {
    font-size: 28px;
    color: #2B331B;
    margin: 0;
}

.addictions-count {
    display: flex;
    align-items: baseline;
    gap: 8px;
    background: #ECEFC2;
    padding: 10px 16px;
    border-radius: 12px;
}

.count-number {
    font-size: 28px;
    font-weight: bold;
    color: #2B331B;
}

.count-label {
    font-size: 16px;
    color: #555;
}

.addictions-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.addiction-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 16px;
    padding: 20px;
    transition: all 0.3s;
}

.addiction-card:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.addiction-card.completed {
    border-color: #7E884C;
    box-shadow: 0 4px 15px rgba(126, 136, 76, 0.12);
}

.addiction-view {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15px;
}

.addiction-info {
    flex: 1;
}

.addiction-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    flex-wrap: wrap;
}

.addiction-name {
    font-size: 20px;
    color: #2B331B;
    margin: 0;
    font-weight: 600;
}

.addiction-days-badge {
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 20px;
    background: #fce4ec;
    color: #c62828;
    white-space: nowrap;
    font-weight: 500;
}

.addiction-days-badge.ending-soon {
    background: #fff3e0;
    color: #e65100;
}

.addiction-dates {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.date-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.date-label {
    font-size: 12px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.date-value {
    font-size: 14px;
    color: #555;
}

.status-text {
    margin-top: 14px;
    font-size: 14px;
    color: #666;
    font-weight: 500;
}

.addiction-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.action-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
}

.check-btn {
    background: #f0f4e1;
    color: #7E884C;
}

.check-btn:hover {
    background: #7E884C;
    color: white;
}

.delete-btn {
    background: #ffebee;
    color: #c62828;
}

.delete-btn:hover {
    background: #c62828;
    color: white;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
}

.empty-title {
    font-size: 22px;
    color: #2B331B;
    margin: 0 0 10px;
}

.empty-text {
    font-size: 16px;
    color: #888;
    margin: 0;
}
</style>