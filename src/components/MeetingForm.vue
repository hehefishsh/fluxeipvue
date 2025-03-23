<template>
    <div>
      <el-tabs v-model="selectedStatus">
        <el-tab-pane label="所有預約" name="all"></el-tab-pane>
        <el-tab-pane label="審核中" name="審核中"></el-tab-pane>
        <el-tab-pane label="已審核" name="已審核"></el-tab-pane>
        <el-tab-pane label="未核准" name="未核准"></el-tab-pane>
      </el-tabs>
  
      <el-table
        :data="filterMeetings"
        border
        style="width: 100%"
        stripe
        :default-sort="{ prop: 'createdAt', order: 'ascending' }"
        empty-text="無此資料"
      >
        <el-table-column prop="createdAt" label="申請時間" width="180" sortable>
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
  
        <el-table-column prop="employeeName" label="姓名" width="120" />
        <el-table-column prop="roomName" label="會議室" width="160" />
        <el-table-column prop="title" label="主題" min-width="160" />
         <!-- <el-table-column prop="notes" label="內容" min-width="200" />-->
  
        <el-table-column prop="startTime" label="開始時間" width="180" sortable>
          <template #default="{ row }">{{ formatDate(row.startTime) }}</template>
        </el-table-column>
  
        <el-table-column prop="endTime" label="結束時間" width="180" sortable>
          <template #default="{ row }">{{ formatDate(row.endTime) }}</template>
        </el-table-column>
  
        <el-table-column prop="statusName" label="狀態" width="120">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.statusName)">
              {{ row.statusName }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 在審核中才顯示審核操作欄位 -->
        <el-table-column v-if="showApprovalColumn" label="審核操作" width="200">
          <template #default="{ row }">
            <el-button type="success" size="small" class="me-2" @click="approve(row.id)">通過</el-button>
        <el-button type="danger" size="small" @click="reject(row.id)">拒絕</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </template>
  
  <script setup>
import { ref, computed, defineProps } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const props = defineProps({
  meetings: {
    type: Array,
    required: true,
    default: () => [],
  },
  employeeId: Number, 
});

const selectedStatus = ref("all");

// 篩選資料
const filterMeetings = computed(() => {
  if (!props.meetings) return [];
  if (selectedStatus.value === "all") return props.meetings;
  return props.meetings.filter(m => m.statusName === selectedStatus.value);
});

// 顯示「審核操作」欄的條件
const showApprovalColumn = computed(() => {
  return props.employeeId === 1002 && selectedStatus.value === "審核中";
});

// 時間格式化
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();
}

// 狀態顏色
function statusTagType(status) {
  switch (status) {
    case "審核中":
      return "warning";
    case "已審核":
      return "success";
    case "未核准":
      return "danger";
    default:
      return "info";
  }
}

//  審核請求
async function approve(meetingId) {
  try {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/meetings/${meetingId}/approve`, null, {
      params: {
        employeeId: props.employeeId,
        isApproved: true,
      },
    });
    Swal.fire("成功", "會議已通過審核", "success");
    emit("refresh");
  } catch (error) {
    Swal.fire("錯誤", "審核失敗：" + error.message, "error");
  }
}

async function reject(meetingId) {
  try {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/meetings/${meetingId}/approve`, null, {
      params: {
        employeeId: props.employeeId,
        isApproved: false,
      },
    });
    Swal.fire("成功", "會議已被拒絕", "success");
    emit("refresh");
  } catch (error) {
    Swal.fire("錯誤", "拒絕失敗：" + error.message, "error");
  }
}
</script>

  
  <style scoped>
  .el-table {
    margin-top: 10px;
  }
  </style>
  