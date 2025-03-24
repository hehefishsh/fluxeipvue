<template>
  <div>
    <!-- 簽核流程管理 -->
    <div class="card card-default" id="approval-flow-management">
      <div class="card-header">
        <h2>簽核流程管理</h2>
      </div>
      <div class="card-body py-0" data-simplebar>
        <!-- 顯示錯誤信息 -->
        <div v-show="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <!-- 顯示簽核流程列表 -->
        <div v-if="approvalFlows.length">
          <table class="table table-borderless table-thead-border">
            <thead>
              <tr>
                <th class="text">流程 ID</th>
                <th class="text">流程名稱</th>
                <th class="text">請求類型</th>
                <th class="text">步驟數</th>
                <th class="text">適用職位</th>
                <th class="text">簽核職位</th>
                <th class="text">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(flow, index) in approvalFlows" :key="index">
                <td class="text">{{ flow.flowId }}</td>
                <td class="text">{{ flow.flowName }}</td>
                <td class="text">{{ flow.requestType }}</td>
                <td class="text">{{ flow.stepOrder }}</td>
                <td class="text">{{ flow.employeePosition }}</td>
                <td class="text">{{ flow.approverPosition }}</td>
                <td class="text">
                  <button
                    v-if="flow.stepOrder === 1"
                    class="badge badge-square badge-danger"
                    @click="deleteFlow(flow.flowId)"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p class="text-center text-muted">無簽核流程資料</p>
        </div>
        <div class="bg-white py-4"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import axiosapi from "@/plugins/axios";

const approvalFlows = ref([]);
const error = ref("");

// 載入簽核流程列表
const loadApprovalFlows = async () => {
  try {
    const response = await axiosapi.get("/api/approval/flow/all");
    approvalFlows.value = response.data;
  } catch (err) {
    error.value = "無法獲取簽核流程資料";
  }
};

// 刪除簽核流程
const deleteFlow = async (flowId) => {
  Swal.fire({
    title: "確定要刪除此簽核流程嗎？",
    text: "此操作無法復原！",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "是，刪除！",
    cancelButtonText: "取消",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axiosapi.delete(`/api/approval/delete/approval-flows/${flowId}`);
        approvalFlows.value = approvalFlows.value.filter(
          (flow) => flow.flowId !== flowId
        );

        Swal.fire({
          title: "刪除成功！",
          text: "該簽核流程已被刪除。",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => loadApprovalFlows());
      } catch (err) {
        Swal.fire({
          title: "刪除失敗！",
          text: "請稍後再試。",
          icon: "error",
          confirmButtonText: "確定",
        });
      }
    }
  });
};

// 頁面加載時查詢簽核流程
onMounted(loadApprovalFlows);
</script>

<style scoped>
.table td,
.table th {
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.text {
  white-space: nowrap;
}
</style>
