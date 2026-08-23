<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const menuItems = [
  { path: '/example/1', title: 'Сотрудники', icon: '👥' },
  { path: '/example/2', title: 'Сортировка', icon: '🔽' },
  { path: '/example/3', title: 'Фильтрация', icon: '🔍' },
  { path: '/example/4', title: 'Render & Editor', icon: '🎨' },
  { path: '/example/5', title: 'Selection', icon: '✅' },
  { path: '/example/6', title: 'Закрепленные строки', icon: '📌' },
  { path: '/example/7', title: 'Сохранение состояния', icon: '💾' },
  { path: '/example/8', title: 'Транзакции', icon: '⚡' },
  { path: '/example/9', title: 'Infinite Row Model', icon: '📦' },
  { path: '/example/10', title: 'Кастомный фильтр', icon: '🔧' },
  { path: '/example/11', title: 'Кастомный editor', icon: '✏️' },
  { path: '/example/12', title: 'Pagination', icon: '📄' },
  { path: '/example/13', title: 'Keyboard Nav', icon: '⌨️' },
  { path: '/example/14', title: 'Localisation', icon: '🌍' }
]
</script>

<template>
  <aside :class="['sidebar', { collapsed: !isOpen }]">
    <div class="sidebar-header">
      <span v-if="isOpen" class="brand">AG‑Grid Examples</span>
      <span v-else class="brand-short">AG</span>

      <button
        class="toggle-btn"
        @click="emit('toggle')"
        :aria-label="isOpen ? 'Свернуть сайдбар' : 'Развернуть сайдбар'"
        :title="isOpen ? 'Свернуть' : 'Развернуть'"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          :style="{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    </div>

    <nav class="nav">
      <ul>
        <li v-for="item in menuItems" :key="item.path">
          <RouterLink :to="item.path" active-class="active">
            <span class="icon">{{ item.icon }}</span>
            <span v-if="isOpen" class="title">{{ item.title }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div v-if="isOpen" class="sidebar-footer">
      <small>v1.0.0</small>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 260px;
  background: #1e293b;
  color: #e2e8f0;
  transition: width 0.3s ease;
  overflow: visible;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
}

.sidebar.collapsed {
  width: 72px;
}

/* Шапка сайдбара */
.sidebar-header {
  position: relative;
  padding: 24px 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand {
  font-size: 1.3rem;
  font-weight: 600;
  color: #f1f5f9;
}

.brand-short {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f1f5f9;
}

/* Плавающая кнопка-переключатель */
.toggle-btn {
  position: absolute;
  right: -27px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 48px;
  background: white;
  border: 1px solid #e2e8f0;
  border-left: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s, right 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  padding: 0;
  z-index: 10;
}

.toggle-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
}

.toggle-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.sidebar.collapsed .toggle-btn {
  right: -27px;
}

/* Навигация */
.nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 8px;
}

.nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav li {
  margin-bottom: 4px;
}

.nav a {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  border-radius: 8px;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.95rem;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.nav a:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #f8fafc;
}

.nav a.active {
  background: #3b82f6;
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

.nav a .icon {
  font-size: 1.3rem;
  width: 28px;
  text-align: center;
  flex-shrink: 0;
}

.nav a .title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Свёрнутое состояние навигации */
.sidebar.collapsed .nav a {
  justify-content: center;
  padding: 10px 0;
}

.sidebar.collapsed .nav a .title {
  display: none;
}

.sidebar.collapsed .nav a .icon {
  font-size: 1.6rem;
  width: auto;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.75rem;
  color: #64748b;
  text-align: center;
}
</style>
