<template>
  <div>
    <MeetingForm :meetings="meetings"></MeetingForm>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import useUserStore from "@/stores/user";
import MeetingForm from "@/components/MeetingForm.vue"; 

const path = import.meta.env.VITE_API_URL;
const userStore = useUserStore();
const meetings = ref([]); 

onMounted(() => {
  callFind();
});

// 🔹 取得會議資料
async function callFind() {
  try {
    const userRole = userStore.roleName;
    const userId = userStore.empId;
    let response;

    if (["最高管理員", "次等管理員"].includes(userRole)) {
      response = await axios.get(`${path}/api/meetings`);
    } else {
      response = await axios.get(`${path}/api/meetings/user/${userId}`);
    }

    meetings.value = response.data || [];
  } catch (error) {
    console.error("查詢失敗:", error);
    Swal.fire("錯誤", "讀取會議資料失敗：" + error.message, "error");
  }
}


</script>

<style scoped>

</style>


