<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <div class="col-4">
        <input type="text" class="form-control" placeholder="搜尋會議室..." v-model.lazy.trim="search" @input="applyFilter">
      </div>
      <div class="col text-end">
        <button  class="btn btn-outline-primary btn-pill" @click="openAddModal">新增會議室</button>
      </div>
    </div>

    <!-- 會議室卡片 -->
    <div class="row">
      <div class="col-lg-4 col-md-6 mb-4" v-for="item in paginatedRooms" :key="item.id">
        <RoomCard :item="item" @open-update="openEditModal" @delete="callRemoveRoom"></RoomCard>
      </div>
    </div>

  <!-- 新增修改Modal -->
    <RoomModal 
        v-if="isModalOpen" 
        :isOpen="isModalOpen"
        :isEdit="isEditMode"
        :room="selectedRoom"
        @close="closeModal"
        @save="handleSave"
    />

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
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import Paginate from 'vuejs-paginate-next';
import RoomCard from '@/components/RoomCard.vue';
import RoomModal from '@/components/RoomModal.vue';

const path = import.meta.env.VITE_API_URL;

const current = ref(1);
const pages = ref(0);
const rows = ref(6);
const rooms = ref([]);
const filteredRooms = ref([]);
const search = ref("");

const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedRoom = ref(null);


onMounted(() => {
  callFind();
});

// 監聽搜尋欄位變化
watch(search, () => {
  current.value = 1;
  applyFilter();
});

// 取得所有會議室
async function callFind() {
  try {
    const response = await axios.get(`${path}/api/rooms`);
    rooms.value = response.data || [];
    applyFilter();
  } catch (error) {
    console.error("查詢失敗:", error);
    Swal.fire("錯誤", "讀取會議室失敗：" + error.message, "error");
  }
}

// 過濾搜尋結果
function applyFilter() {
  if (!search.value) {
    filteredRooms.value = rooms.value;
  } else {
    filteredRooms.value = rooms.value.filter(room =>
      room.roomName.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  pages.value = Math.ceil(filteredRooms.value.length / rows.value);
}

// 新增方法
function openAddModal() {
  isEditMode.value = false;
  selectedRoom.value = { roomName: "", capacity: 1, location: "" };
  isModalOpen.value = true;
}

// 修改方法
function openEditModal(room) {
  console.log("開啟編輯會議室", room); //  測試
  if (!room || !room.id) {
    Swal.fire("錯誤", "無法編輯：會議室 ID 不存在", "error");
    return;
  }
  isEditMode.value = true;
  selectedRoom.value = { ...room };
  isModalOpen.value = true;
}


// 切換分頁
function changePage(page) {
  current.value = page;
}

// 按鈕取消方法
function closeModal() {
  isModalOpen.value = false;
}

// 新增或修改會議室
async function handleSave(roomData) {
  try {
    let newRoom;

    if (isEditMode.value) {
      if (!roomData.id) {
        Swal.fire("錯誤", "無法更新：會議室 ID 不存在", "error");
        return;
      }
      newRoom = await callUpdateRoom(roomData.id, roomData);
    } else {
      newRoom = await callCreateRoom(roomData);
    }

    if (roomData.image && newRoom?.id) {
      await uploadRoomImage(newRoom.id, roomData.image);
    }

    isModalOpen.value = false;
  } catch (error) {
    console.error("儲存失敗:", error); //  測試
    Swal.fire("錯誤", `儲存失敗：${error.message}`, "error");
  }
}




// 新增
async function callCreateRoom(roomData) {
  try {
    const response = await axios.post(`${path}/api/rooms`, {
      roomName: roomData.roomName,
      capacity: roomData.capacity,
      location: roomData.location
    });
    Swal.fire("成功", "新增會議室成功！", "success");
    callFind();
    return response.data;
  } catch (error) {
    console.error("新增失敗:", error); //  測試
    Swal.fire("錯誤", "新增失敗：" + error.message, "error");
  }
}

// 更新
async function callUpdateRoom(id, roomData) {
  if (!id) {
    Swal.fire("錯誤", "無法更新：缺少會議室 ID", "error");
    return;
  }

  try {
    const response = await axios.put(`${path}/api/rooms/${id}`, {
      roomName: roomData.roomName,
      capacity: roomData.capacity,
      location: roomData.location
    });

    Swal.fire("成功", "更新會議室成功！", "success");
    callFind();
    return response.data;
  } catch (error) {
    console.error("更新失敗:", error); //  測試
    Swal.fire("錯誤", `更新失敗：${error.response?.data?.message || error.message}`, "error");
  }
}



// 上傳圖片
async function uploadRoomImage(roomId, file) {
  if (!file) {
    Swal.fire("錯誤", "請選擇一張圖片", "error");
    return;
  }

  let formData = new FormData();
  formData.append("file", file);

  try {
    await axios.post(`${path}/api/rooms/${roomId}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    Swal.fire("成功", "圖片上傳成功！", "success");
    callFind();
  } catch (error) {
    console.error("圖片上傳失敗:", error); //  測試
    Swal.fire("錯誤", "圖片上傳失敗：" + error.message, "error");
  }
}


// 刪除
async function callRemoveRoom(id) {
  Swal.fire({
    title: "確定要刪除嗎？",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${path}/api/rooms/${id}`);
        Swal.fire("成功", "刪除成功！", "success");
        callFind();
      } catch (error) {
        console.error("刪除失敗:", error);
        Swal.fire("錯誤", "刪除失敗：" + error.message, "error");
      }
    }
  });
}

// 計算分頁
const paginatedRooms = computed(() => {
  const start = (current.value - 1) * rows.value;
  const end = start + rows.value;
  return filteredRooms.value.slice(start, end) || [];
});




</script>




<style scoped>
.pagination {
  display: flex;
  justify-content: center;
}
</style>
