<template>
  <div>
    <MeetingForm
  :meetings="paginatedMeetings"
  :employeeId="userStore.empId"
  @refresh="refreshMeetings"
/>


    <Pagination
      v-model="currentPage"
      :total-items="allMeetings.length"
      :items-per-page="itemsPerPage"
    />
  </div>
</template>

<script setup>
import Pagination from "@/components/Pagination.vue";
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import useUserStore from "@/stores/user";
import MeetingForm from "@/components/MeetingForm.vue";

const userStore = useUserStore();
const path = import.meta.env.VITE_API_URL;

const allMeetings = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;

const paginatedMeetings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allMeetings.value.slice(start, end);
});

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


