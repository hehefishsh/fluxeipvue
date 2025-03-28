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
                <th class="text">其他</th>
                <th class="text">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(flow, index) in paginatedFlows" :key="index">
                <td class="text">{{ flow.flowId }}</td>
                <td class="text">{{ flow.flowName }}</td>
                <td class="text">{{ flow.requestType }}</td>
                <td class="text">{{ flow.stepOrder }}</td>
                <td class="text">{{ flow.employeePosition }}</td>
                <td class="text">{{ flow.approverPosition }}</td>
                <td>
                  <h6>
                    <button
                      class="badge badge-info"
                      @click="showModal(flow)"
                      data-toggle="modal"
                      data-target="#approvalFlowManageModal"
                    >
                      查看詳情
                    </button>
                  </h6>
                </td>
                <td class="text">
                  <h6>
                    <button
                      v-if="flow.stepOrder === 1"
                      class="badge badge-square badge-danger"
                      @click="deleteFlow(flow.flowId)"
                    >
                      刪除
                    </button>
                  </h6>
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
      <!-- 分頁 -->
      <nav
        aria-label="Page navigation example"
        class="d-flex justify-content-center"
      >
        <ul class="pagination pagination-separated">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(currentPage - 1)"
            >
              <span aria-hidden="true" class="mdi mdi-chevron-left mr-1"></span>
              Prev
            </a>
          </li>
          <li
            class="page-item"
            v-for="page in visiblePages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <a
              v-if="page !== '...'"
              class="page-link"
              href="#"
              @click.prevent="changePage(page)"
            >
              {{ page }}
            </a>
            <span v-else class="page-link">...</span>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(currentPage + 1)"
            >
              Next
              <span
                aria-hidden="true"
                class="mdi mdi-chevron-right ml-1"
              ></span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="bg-white py-4"></div>
    </div>
    <ApprovalFlowManageDetails
      :approvalFlowManage="selectedApprovalFlowManage"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import axiosapi from "@/plugins/axios";
import ApprovalFlowManageDetails from "./ApprovalFlowManageDetails.vue";

const approvalFlows = ref([]);
const error = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;
const selectedApprovalFlowManage = ref(null);

const showModal = (request) => {
  selectedApprovalFlowManage.value = request;
};

const totalPages = computed(() =>
  Math.ceil(approvalFlows.value.length / itemsPerPage)
);

const paginatedFlows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return approvalFlows.value.slice(start, start + itemsPerPage);
});

const visiblePages = computed(() => {
  const pages = [];
  if (totalPages.value <= 4) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (currentPage.value > 3) pages.push("...");

    let start = Math.max(2, currentPage.value - 1);
    let end = Math.min(totalPages.value - 1, currentPage.value + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage.value < totalPages.value - 2) pages.push("...");
    pages.push(totalPages.value);
  }
  return pages;
});

const changePage = (page) => {
  if (page !== "..." && page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const loadApprovalFlows = async () => {
  try {
    const response = await axiosapi.get("/api/approval/flow/stepone/all");
    approvalFlows.value = response.data;
  } catch (err) {
    error.value = "無法獲取簽核流程資料";
  }
};

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
