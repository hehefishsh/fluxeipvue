<template>
  <div class="card card-default" id="employee-search">
    <div class="card-header">
      <h3><span class="badge badge-secondary">查詢員工</span></h3>
    </div>
    <div class="card-body py-0" data-simplebar>
      <!-- 查詢條件 -->

      <label>部門：</label>
      <select v-model="department" class="custom-select my-1 mr-sm-2">
        <option
          v-for="dep in departments"
          :key="dep.id"
          :value="dep.departmentName"
        >
          {{ dep.departmentName }}
        </option>
      </select>

      <label>職位：</label>
      <select v-model="position" class="custom-select my-1 mr-sm-2">
        <option
          v-for="pos in positions"
          :key="pos.positionId"
          :value="pos.positionName"
        >
          {{ pos.positionName }}
        </option>
      </select>

      <!-- 搜尋按鈕 -->
      <button type="button" @click="searchEmployees(1)" class="submit-button">
        查詢
      </button>

      <!-- 查詢結果 -->
      <div v-if="employees.length > 0">
        <br />
        <h4></h4>
        <ul class="list-group">
          <li
            v-for="employee in employees"
            :key="employee.id"
            class="list-group-item list-group-item-action"
          >
            <div class="media media-sm mb-0">
              <div class="media-body">
                <span class="title"
                  >{{ employee.employeeId }}-{{ employee.employeeName }}</span
                >
                <p>
                  {{ employee.department.departmentName }} -
                  {{ employee.position.positionName }}
                </p>
              </div>
              <div class="custom-control custom-checkbox align-self-center">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  :id="'customCheck' + employee.employeeId"
                  v-model="selectedEmployees"
                  :value="employee.employeeId"
                />
                <label
                  class="custom-control-label"
                  :for="'customCheck' + employee.employeeId"
                ></label>
              </div>
            </div>
          </li>
        </ul>
        <br />
      </div>

      <!-- 分頁控制 -->
      <!-- Separated Pagination -->
      <div
        class="align-items-center"
        v-if="employees.length > 0 && totalPages > 1"
      >
        <nav aria-label="Page navigation example">
          <ul
            class="pagination pagination-seperated pagination-seperated-rounded"
          >
            <li class="page-item" :class="{ disabled: pageNumber <= 1 }">
              <a
                class="page-link"
                href="#"
                @click="searchEmployees(pageNumber - 1)"
                aria-label="Previous"
              >
                <span
                  aria-hidden="true"
                  class="mdi mdi-chevron-left mr-1"
                ></span>
                Prev
                <span class="sr-only">Previous</span>
              </a>
            </li>

            <!-- 動態生成頁面數量 -->
            <li
              v-for="page in totalPagesArray"
              :key="page"
              class="page-item"
              :class="{ active: pageNumber === page }"
            >
              <a class="page-link" href="#" @click="searchEmployees(page)">
                {{ page }}
              </a>
            </li>

            <li
              class="page-item"
              :class="{ disabled: pageNumber >= totalPages }"
            >
              <a
                class="page-link"
                href="#"
                @click="searchEmployees(pageNumber + 1)"
                aria-label="Next"
              >
                Next
                <span
                  aria-hidden="true"
                  class="mdi mdi-chevron-right ml-1"
                ></span>
                <span class="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div v-if="approvalFlows.length">
        <br />
        <h3><span class="badge badge-secondary">審核流程</span></h3>
        <table class="table table-borderless table-thead-border">
          <thead>
            <tr>
              <th class="text">流程 ID</th>
              <th class="text">流程名稱</th>
              <th class="text">請求類型</th>
              <th class="text">步驟數</th>
              <th class="text">適用職位</th>
              <th class="text">簽核職位</th>
              <th class="text">選擇</th>
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
                <!-- 只有 stepOrder 為 1 的流程才顯示勾選框 -->
                <input
                  v-if="flow.stepOrder === 1"
                  type="checkbox"
                  :id="'flowCheck' + flow.flowId"
                  v-model="selectedFlows"
                  :value="flow.flowId"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p class="text-center text-muted">無簽核流程資料</p>
      </div>

      <!-- 提交選擇的簽核流程 -->
      <div
        v-if="selectedEmployees.length > 0 && selectedFlows.length > 0"
        style="margin-top: 20px"
      >
        <button type="button" @click="submitEmployeeFlow" class="submit-button">
          提交選擇的簽核流程
        </button>
      </div>
    </div>
    <div class="bg-white py-4"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axiosapi from "@/plugins/axios.js";
import Swal from "sweetalert2";

const department = ref(null);
const position = ref(null);
const status = ref(null);
const pageNumber = ref(1);
const pageSize = ref(5);
const selectedEmployees = ref([]); // 確保選擇的是單一員工
const selectedFlows = ref([]); // 只存 stepOrder === 1 的流程

const departments = ref([]);
const positions = ref([]);
const statuses = ref([
  { id: 1, statusName: "在職" },
  { id: 2, statusName: "離職" },
]);

const employees = ref([]);
const totalPages = ref(1);
const approvalFlows = ref([]);

// 取得部門、職位及簽核流程列表
onMounted(async () => {
  try {
    const departmentResponse = await axiosapi.get("/department/find");
    departments.value = departmentResponse.data;

    const positionResponse = await axiosapi.get("/position/find");
    positions.value = positionResponse.data;

    const flowResponse = await axiosapi.get("/api/approval/flow/all");
    approvalFlows.value = flowResponse.data;
  } catch (error) {
    console.error(
      "Error fetching departments, positions, and approval flows:",
      error
    );
  }
});

// 查詢員工
async function searchEmployees(page) {
  try {
    if (page < 1 || page > totalPages.value) return;

    pageNumber.value = page;
    const requestPayload = {
      department: department.value,
      position: position.value,
    };

    const response = await axiosapi.post(
      `/employee/search?page=${pageNumber.value - 1}&size=${pageSize.value}`,
      requestPayload
    );

    if (!response.data || !response.data.content) {
      throw new Error("無法取得員工資料");
    }

    employees.value = response.data.content;
    totalPages.value = response.data.totalPages || 1;
  } catch (error) {
    console.error("Error searching employees:", error);
  }
}

// 計算總頁數的數組
const totalPagesArray = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1);
});

// 提交員工與簽核流程
async function submitEmployeeFlow() {
  try {
    if (selectedEmployees.value.length === 0) {
      alert("請選擇至少一名員工");
      return;
    }
    if (selectedFlows.value.length === 0) {
      alert("請選擇至少一個簽核流程");
      return;
    }

    // 讓每位員工綁定所有選擇的簽核流程
    const requestData = selectedEmployees.value.flatMap((employeeId) =>
      selectedFlows.value.map((flowId) => ({
        employeeId: employeeId,
        flowId: flowId,
      }))
    );

    const response = await axiosapi.post(
      "/api/employee-approval-flows/create",
      requestData
    );
    Swal.fire({
      title: "成功!",
      text: response.data,
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "/approvalflow/assign";
    });
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMessage =
        error.response.data || "指派員工自訂簽核流程設置失敗";
      Swal.fire({
        title: "錯誤!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "重新提交",
      });
    } else {
      Swal.fire({
        title: "錯誤!",
        text: "提交綁定時發生未知錯誤",
        icon: "error",
        confirmButtonText: "重新提交",
      });
    }
  }
}
</script>
<style>
.submit-button {
  padding: 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: #008cba;
  color: white;
}
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 16px;
  font-weight: bold;
}
</style>
