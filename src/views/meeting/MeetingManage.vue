<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <div class="col-4">
        <input type="text" class="form-control" placeholder="搜尋會議室..." v-model.lazy.trim="search" @input="applyFilter">
      </div>
      <div class="col d-flex justify-content-end">
        <button v-if="isAdmin" class="btn btn-outline-primary btn-pill" @click="openAddModal">新增會議室</button>
      </div>
    </div>

    <!-- 會議室卡片 -->
    <div class="row">
      <div class="col-lg-4 col-md-6 mb-4" v-for="item in paginatedRooms" :key="item.id">
        <RoomCard :item="item" :roleName="roleName" @open-update="openEditModal" @delete="callRemoveRoom"
        @openReserve="openReserve" ></RoomCard>
      </div>
    </div>

    <!-- 新增修改Modal -->
    <RoomModal v-if="isModalOpen" :isOpen="isModalOpen":isEdit="isEditMode":room="selectedRoom"@close="closeModal"@save="handleSave">
    </RoomModal>

    <!-- 預約表單Modal -->
    <ReserveModal v-model:isOpen="isReserveModalOpen" :room="selectedRoom" :employee="userStore" 
    @reserve="handleReserve">
    </ReserveModal>
  

    <!-- 分頁按鈕 -->
    <div class="row justify-content-center mt-4">
    <Paginate :first-last-button="true" first-button-text="&lt;&lt;" last-button-text="&gt;&gt;"
              prev-text="&lt;" next-text="&gt;" :initial-page="current" :page-count="pages"
              :page-range="3" :margin-pages="2" :click-handler="changePage" class="pagination">
    </Paginate>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import Paginate from 'vuejs-paginate-next';
import useUserStore from '@/stores/user';
import RoomCard from '@/components/RoomCard.vue';
import RoomModal from '@/components/RoomModal.vue';
import ReserveModal from '@/components/ReserveModal.vue';

const path = import.meta.env.VITE_API_URL;

// 使用者資訊與權限
const userStore = useUserStore();
const roleName = ref(userStore.roleName);
const isAdmin = computed(() => {
  return roleName.value === "最高管理員" || roleName.value === "次等管理員";
});

// 分頁與會議室資料
const current = ref(1);
const pages = ref(0);
const rows = ref(6);
const rooms = ref([]);
const filteredRooms = ref([]);
const search = ref("");


// Modal 狀態管理
const isModalOpen = ref(false);
const isEditMode = ref(false);
const isReserveModalOpen = ref(false);
const selectedRoom = ref(null);


const meetings = ref([]); 


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

// 計算分頁
const paginatedRooms = computed(() => {
  const start = (current.value - 1) * rows.value;
  const end = start + rows.value;
  return filteredRooms.value.slice(start, end) || [];
});

// 新增會議室
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
    console.error("新增失敗:", error);
    Swal.fire("錯誤", "新增失敗：" + error.message, "error");
  }
}

// 更新會議室
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
    console.error("更新失敗:", error);
    Swal.fire("錯誤", `更新失敗：${error.response?.data?.message || error.message}`, "error");
  }
}

// 刪除會議室
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

// 會議室圖片上傳
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
    console.error("圖片上傳失敗:", error);
    Swal.fire("錯誤", "圖片上傳失敗：" + error.message, "error");
  }
}


function closeModal() {
  isModalOpen.value = false;
  isEditMode.value = false;
  selectedRoom.value = null; // 清空選擇的房間資料
}




// 新增會議室 Modal
function openAddModal() {
  isEditMode.value = false;
  selectedRoom.value = { roomName: "", capacity: 1, location: "" };
  isModalOpen.value = true;
}

// 編輯會議室 Modal
function openEditModal(room) {
  if (!room || !room.id) {
    Swal.fire("錯誤", "無法編輯：會議室 ID 不存在", "error");
    return;
  }
  isEditMode.value = true;
  selectedRoom.value = { ...room };
  isModalOpen.value = true;
}

// 預約 Modal
function openReserve(room) {
  if (!room || !room.roomName) {
    console.error("錯誤：會議室資料為空或無效", room);
    Swal.fire("錯誤", "會議室資料載入失敗", "error");
    return;
  }
  selectedRoom.value = { ...room };
  isReserveModalOpen.value = true;
}

// 儲存會議室（新增或修改）
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
    console.error("儲存失敗:", error);
    Swal.fire("錯誤", `儲存失敗：${error.message}`, "error");
  }
}

// 預約會議室

async function handleReserve(meeting) {
  try {
    console.log("收到預約資料：", meeting);  // ✅ 確保 `meeting` 資料正確

    if (!meeting.employeeId) {
      Swal.fire("錯誤", "無法獲取申請人資訊，請重新登入", "error");
      return;
    }


  
    const formattedStartTime = `${meeting.date}T${meeting.startTime}:00`;
    const formattedEndTime = `${meeting.date}T${meeting.endTime}:00`;

    const requestData = {
      title: meeting.title,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      roomId: meeting.roomId,
      roomName: meeting.roomName,
      employeeId: meeting.employeeId,
      employeeName: meeting.employeeName,
    };

    console.log("發送的預約資料：", requestData);

    const response = await axios.post(`${path}/api/meetings`, requestData);


    if (response.data.message.includes("衝突") || response.data.message.includes("不合法")) {
      Swal.fire("錯誤", response.data.message, "error");
      return;
    }

    // **確保 `meetings.value` 被正確更新**
    meetings.value.push(response.data);

    Swal.fire("成功", "會議室預約成功！", "success");
    isReserveModalOpen.value = false;
  } catch (error) {
    console.error("預約失敗:", error);

    if (error.response && error.response.status === 400) {
      Swal.fire("錯誤", error.response.data.message, "error");
    } else {
      Swal.fire("錯誤", "預約失敗：" + error.message, "error");
    }
  }
  
}


// 切換分頁
function changePage(page) {
  current.value = page;
}

</script>


<style scoped>
.pagination {
  display: flex;
  justify-content: center;
}
</style>
