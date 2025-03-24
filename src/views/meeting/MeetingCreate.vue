<template>
  <div>
    <MeetingForm
      :meetings="paginatedMeetings"
      :employeeId="userStore.empId"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :selectedStatus="selectedStatus"
      @refresh="refreshMeetings"
      @change-page="handlePageChange"
      @change-status="handleStatusChange"
      @change-sort="handleSortChange"
    />
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import useUserStore from "@/stores/user";
import MeetingForm from "@/components/MeetingForm.vue";

const userStore = useUserStore();
const path = import.meta.env.VITE_API_URL;

const allMeetings = ref([]);
const selectedStatus = ref("all");
const currentPage = ref(1);
const itemsPerPage = 10;

const sortInfo = ref({
  prop: "createdAt",
  order: "ascending",
});

onMounted(callFind);




async function callFind() {
  try {
    const userRole = userStore.roleName;
    const userId = userStore.empId;
    const res = ["最高管理員", "次等管理員"].includes(userRole)
      ? await axios.get(`${path}/api/meetings`)
      : await axios.get(`${path}/api/meetings/user/${userId}`);
    allMeetings.value = res.data || [];
  } catch (error) {
    console.error("讀取失敗", error);
  }
}

function refreshMeetings() {
  callFind();
}

const filteredAndSorted = computed(() => {
  let filtered = selectedStatus.value === "all"
    ? allMeetings.value
    : allMeetings.value.filter(m => m.statusName === selectedStatus.value);

  const { prop, order } = sortInfo.value;
  if (prop && order && order !== null) {
    filtered = [...filtered].sort((a, b) => {
      const valA = a[prop];
      const valB = b[prop];
      if (valA == null || valB == null) return 0;
      return order === "ascending"
        ? valA > valB ? 1 : -1
        : valA < valB ? 1 : -1;
    });
  }

  return filtered;
});

const paginatedMeetings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredAndSorted.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredAndSorted.value.length / itemsPerPage);
});

function handlePageChange(newPage) {
  if (newPage > totalPages.value || newPage < 1) return;
  currentPage.value = newPage;
}

function handleStatusChange(newStatus) {
  selectedStatus.value = newStatus;
  currentPage.value = 1; // 切換狀態時重設為第 1 頁
}

function handleSortChange({ prop, order }) {
  sortInfo.value = { prop, order };
}


watch([selectedStatus, currentPage, filteredAndSorted], () => {
  console.log("狀態:", selectedStatus.value);
  console.log("頁碼:", currentPage.value);
  console.log("資料總數:", filteredAndSorted.value.length);
  console.log("目前顯示:", paginatedMeetings.value.map(m => m.title));
});
</script>


