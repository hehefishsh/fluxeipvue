<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <div class="col-4">
        <input type="text" class="form-control" placeholder="搜尋會議室..." v-model.lazy.trim="search" @input="applyFilter">
      </div>
    </div>

    <!-- 會議室卡片 -->
    <div class="row">
      <div class="col-lg-4 col-md-6 mb-4" v-for="item in paginatedRooms" :key="item.id">
        <RoomCard :item="item" @open-update="openModal" @delete="callRemove"></RoomCard>
      </div>
    </div>

    <!-- 分頁按鈕 -->
    <div class="row justify-content-center mt-4">
      <Paginate 
        :first-last-button="true"
        first-button-text="&lt;&lt;"
        last-button-text="&gt;&gt;"
        prev-text="&lt;"
        next-text="&gt;"
        :initial-page="current"
        :page-count="pages"
        :page-range="3"
        :margin-pages="2"
        :click-handler="changePage"
        class="pagination"
      />
    </div>
  </div>
</template>

<script setup>
import Paginate from 'vuejs-paginate-next';
import RoomCard from '@/components/RoomCard.vue';
import { ref, onMounted, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import axios from 'axios';

const current = ref(1); // 目前頁面
const pages = ref(0); // 總頁數
const rows = ref(6); // 每頁顯示幾筆
const rooms = ref([]); // 會議室資料
const filteredRooms = ref([]); // 過濾後的會議室資料
const search = ref(""); // 搜尋輸入內容

const path = import.meta.env.VITE_API_URL;

// 當組件掛載時，自動取得會議室資料
onMounted(() => {
  console.log("組件已掛載，開始取得會議室資料");
  callFind();
});

// 監聽關鍵字搜尋
watch(search, () => {
  console.log("搜尋關鍵字變更，應用過濾器");
  current.value = 1; // 重置頁碼
  applyFilter();
});

// 定義 `openModal` 方法
function openModal(action, id) {
  console.log("openModal", action, id);
}

// 定義 `callRemove` 方法
function callRemove(id) {
  console.log("callRemove", id);
}

// 取得所有會議室
async function callFind(page = current.value) {
  console.log(`查詢會議室資料，頁碼：${page}`);
  try {
    const response = await axios.get(`${path}/pages/ajax/rooms`, {
      params: {
        page: page,
        limit: rows.value,
        search: search.value,
      },
    });
    rooms.value = response.data || [];
    console.log("取得會議室資料：", rooms.value);
    applyFilter();
  } catch (error) {
    console.error("查詢失敗:", error);
    Swal.fire({
      title: "讀取失敗：" + error.message,
      icon: "error",
    });
  }
}

// 應用關鍵字搜尋並計算分頁
function applyFilter() {
  console.log("應用關鍵字搜尋過濾，關鍵字：", search.value);
  if (!search.value) {
    filteredRooms.value = rooms.value;
  } else {
    filteredRooms.value = rooms.value.filter(room =>
      room.roomName.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  pages.value = Math.ceil(filteredRooms.value.length / rows.value);
  console.log("過濾後的會議室資料：", filteredRooms.value);
}

// 切換頁面
function changePage(page) {
  console.log(`切換到頁碼：${page}`);
  current.value = page;
}

// 計算分頁後的會議室資料
const paginatedRooms = computed(() => {
  const start = (current.value - 1) * rows.value;
  const end = start + rows.value;
  const paginatedData = filteredRooms.value.slice(start, end) || [];
  console.log(`分頁後的會議室資料（頁碼 ${current.value}）：`, paginatedData);
  return paginatedData;
});
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
}
</style>
