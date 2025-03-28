<template>
    <li class="custom-dropdown" ref="dropdownRef">
      <button class="notify-toggler" @click="toggleDropdown">
        <span class="bell-wrapper">
          <i class="mdi mdi-bell-outline icon"></i>
          <span class="badge badge-xs" v-if="unreadCount > 0">{{ unreadCount }}</span>
        </span>
      </button>
  
      <div :class="['dropdown-notify', { show: dropdownVisible }]">
        <header class="px-3 py-2 border-bottom">
          <span class="nav-item nav-link active">通知 ({{ notifyList.length }})</span>
        </header>
        <div class="p-2" style="max-height: 300px; overflow-y: auto">
          <div v-if="notifyList.length === 0" class="text-center text-muted">目前無通知</div>
          <div v-for="notify in notifyList" :key="notify.id" class="media media-sm p-2 mb-1" :class="{ 'bg-warning-10': !notify.isRead }">
            <div class="media-body">
              <div class="title">{{ notify.message }}</div>
              <small class="text-muted">{{ formatTime(notify.createTime) }}</small>
            </div>
          </div>
        </div>
        <footer class="border-top text-center py-2">
          <a href="javascript:" class="btn btn-sm" @click="refresh">重新整理</a>
        </footer>
      </div>
    </li>
  </template>
  
  <script setup>
  import { ref, onMounted, watchEffect } from 'vue';
  import useUserStore from '@/stores/user';
  import axios from '@/plugins/axios-login';
  
  const user = useUserStore();
  const dropdownVisible = ref(false);
  const dropdownRef = ref(null);
  const notifyList = ref([]);
  const unreadCount = ref(0);
  
  watchEffect(() => {
    if (user.empId) fetchNotifications();
  });
  
  async function fetchNotifications() {
    try {
      const res = await axios.get(`/api/notify/${user.empId}`);
      notifyList.value = res.data || [];
      unreadCount.value = notifyList.value.filter(n => !n.isRead).length;
    } catch (error) {
      console.error('讀取通知失敗', error);
    }
  }
  
  function toggleDropdown() {
    dropdownVisible.value = !dropdownVisible.value;
    if (dropdownVisible.value) fetchNotifications();
  }
  
  function refresh() {
    fetchNotifications();
  }
  
  function formatTime(timeStr) {
    const time = new Date(timeStr);
    return time.toLocaleString();
  }
  
  // 點擊外部區域關閉 dropdown
  onMounted(() => {
    document.addEventListener('click', (e) => {
      if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
        dropdownVisible.value = false;
      }
    });
  });
  </script>
  
  <style scoped>
  .custom-dropdown {
    position: relative;
    margin: 0;
    padding: 0;
  }
  .notify-toggler {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  .bell-wrapper {
    position: relative;
    display: inline-block;
    width: 28px;
    text-align: center;
  }
  .icon {
    font-size: 30px;
    line-height: 1;
  }
  .badge-xs {
    position: absolute;
    top: -6px;
    right: -8px;
    font-size: 10px;
    padding: 2px 6px;
    background-color: #f54281;
    color: white;
    border-radius: 50%;
    min-width: 18px;
    height: 18px;
    line-height: 14px;
    text-align: center;
    z-index: 10;
  }
  .dropdown-notify {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    width: 320px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  .dropdown-notify.show {
    display: block !important;
  }
  .media-sm {
    border-bottom: 1px solid #eee;
  }
  .title {
    font-weight: bold;
  }
  </style>
  