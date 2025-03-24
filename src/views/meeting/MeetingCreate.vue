<template>
  <div>
    <MeetingForm
      :meetings="allMeetings"
      :employeeId="userStore.empId"
      @refresh="refreshMeetings"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import useUserStore from "@/stores/user";
import MeetingForm from "@/components/MeetingForm.vue";

const userStore = useUserStore();
const path = import.meta.env.VITE_API_URL;

const allMeetings = ref([]);

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

    allMeetings.value = response.data || [];
  } catch (error) {
    console.error("讀取失敗", error);
  }
}

// 提供給子元件刷新用
function refreshMeetings() {
  callFind();
}

onMounted(callFind);
</script>

<style scoped>
</style>
