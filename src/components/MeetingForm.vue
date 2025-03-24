<template>
  <div>
    <el-tabs v-model="localStatus" @tab-click="onStatusChange">
      <el-tab-pane label="所有預約" name="all" />
      <el-tab-pane label="審核中" name="審核中" />
      <el-tab-pane label="已審核" name="已審核" />
      <el-tab-pane label="未核准" name="未核准" />
    </el-tabs>

    <el-table
      :key="tableKey"
      :data="meetings"
      border
      stripe
      style="width: 100%"
      empty-text="無此資料"
      :default-sort="{ prop: 'createdAt', order: 'ascending' }"
      @sort-change="onSortChange"
    >
      <el-table-column prop="createdAt" label="申請時間" width="180" sortable>
        <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
      </el-table-column>

      <el-table-column prop="employeeName" label="姓名" width="120" />
      <el-table-column prop="roomName" label="會議室" width="160" />
      <el-table-column prop="title" label="主題" min-width="160" />

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

      <el-table-column v-if="showApprovalColumn" label="審核操作" width="200">
        <template #default="{ row }">
          <el-button type="success" size="small" class="me-2" @click="approve(row.id)">通過</el-button>
          <el-button type="danger" size="small" @click="reject(row.id)">拒絕</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="d-flex justify-content-center mt-3" v-if="totalPages > 1">
      <Paginate
        :page-count="totalPages"
        :click-handler="changePage"
        :prev-text="'<'"
        :next-text="'>'"
        :container-class="'pagination'"
        :page-range="3"
        :margin-pages="1"
        :force-page="currentPage - 1"
        
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { defineProps, defineEmits } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import Paginate from "vuejs-paginate-next";

const props = defineProps({
  meetings: Array,
  employeeId: Number,
  currentPage: Number,
  totalPages: Number,
  selectedStatus: String,
});

const emit = defineEmits(["refresh", "change-page", "change-status", "change-sort"]);

const localStatus = ref(props.selectedStatus);

// ✅ 修正語法錯誤 - 用反引號
const tableKey = ref(`table-${props.selectedStatus}-${props.currentPage}`);
watch(
  [() => props.currentPage, () => props.selectedStatus],
  () => {
    tableKey.value = `table-${props.selectedStatus}-${props.currentPage}`;
  }
);

// 保持 tab 狀態同步
watch(
  () => props.selectedStatus,
  (val) => {
    localStatus.value = val;
  }
);

function changePage(page) {
  emit("change-page", page + 1); // 分頁元件從 0 開始
}

function onStatusChange(tab) {
  emit("change-status", tab.props.name);
}

const showApprovalColumn = computed(() => {
  return props.employeeId === 1002 && props.selectedStatus === "審核中";
});

function onSortChange({ prop, order }) {
  emit("change-sort", { prop, order });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();
}

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
.pagination {
  display: flex;
  gap: 6px;
}
</style>
