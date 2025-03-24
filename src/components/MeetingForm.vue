<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import Swal from 'sweetalert2';
import axios from 'axios';

const props = defineProps({
  meetings: Array,
  employeeId: Number,
  selectedStatus: String,
  current: Number,
  pages: Number,
});

const emit = defineEmits(["refresh", "change-status", "change-sort", "change-page"]);

function onStatusChange(tab) {
  emit("change-status", tab.props.name);
}

function onSortChange({ prop, order }) {
  emit("change-sort", { prop, order });
}

function changePage(page) {
  if (page !== props.current) {
    emit("change-page", page);
  }
}

const showApprovalColumn = computed(() => {
  return props.employeeId === 1002 && props.selectedStatus === "審核中";
});

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();
}

function statusTagType(status) {
  switch (status) {
    case "審核中": return "warning";
    case "已審核": return "success";
    case "未核准": return "danger";
    default: return "info";
  }
}

async function approve(meetingId) {
  try {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/meetings/${meetingId}/approve`, null, {
      params: { employeeId: props.employeeId, isApproved: true },
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
      params: { employeeId: props.employeeId, isApproved: false },
    });
    Swal.fire("成功", "會議已被拒絕", "success");
    emit("refresh");
  } catch (error) {
    Swal.fire("錯誤", "拒絕失敗：" + error.message, "error");
  }
}
</script>

<template>
  <div>
    <!-- 狀態篩選 -->
    <el-tabs :model-value="props.selectedStatus" @tab-click="onStatusChange">
      <el-tab-pane label="所有預約" name="all" />
      <el-tab-pane label="審核中" name="審核中" />
      <el-tab-pane label="已審核" name="已審核" />
      <el-tab-pane label="未核准" name="未核准" />
    </el-tabs>

    <!-- Debug -->
    <div class="text-center text-muted small my-2">
      🐞 debug｜selectedStatus: <strong>{{ props.selectedStatus }}</strong>｜
      current: <strong>{{ props.current }}</strong>｜
      pages: <strong>{{ props.pages }}</strong>
    </div>

    <!-- 表格 -->
    <el-table
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

    <!-- 原生分頁按鈕 -->
    <div class="pagination mt-3" v-if="props.pages > 1">
      <button @click="changePage(props.current - 1)" :disabled="props.current === 1">＜</button>
      <button
        v-for="page in props.pages"
        :key="page"
        :class="{ active: props.current === page }"
        @click="changePage(page)"
      >{{ page }}</button>
      <button @click="changePage(props.current + 1)" :disabled="props.current === props.pages">＞</button>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.pagination button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button.active {
  background-color: #9254de;
  color: white;
  font-weight: bold;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
