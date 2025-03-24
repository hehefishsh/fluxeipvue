<template>
  <div class="card card-default" id="leave-request">
    <div class="card-header">
      <h2>設定員工自訂簽核流程</h2>
    </div>
    <div class="card-body py-0" data-simplebar>
      <!-- 輸入流程名稱 -->
      <div>
        <h4><span class="badge badge-primary badge-pill">流程名稱</span></h4>

        <input
          v-model="flowName"
          type="text"
          placeholder="請輸入流程名稱"
          class="form-control"
          style="margin-top: 10px"
        />
      </div>

      <!-- 簽核步驟列表 -->
      <div
        v-for="(step, index) in approvalSteps"
        :key="index"
        class="step-group"
      >
        <h3>步驟 {{ index + 1 }}</h3>

        <label>請求類型：</label>
        <select
          v-model="step.requestTypeId"
          class="custom-select my-1 mr-sm-2"
          :disabled="index !== 0"
        >
          <option v-for="type in leaveTypes" :key="type.id" :value="type.id">
            {{ type.typeName }}
          </option>
        </select>

        <label>員工職位：</label>
        <select
          v-model="step.employeePositionId"
          class="custom-select my-1 mr-sm-2"
          :disabled="index !== 0"
        >
          <option
            v-for="position in positions"
            :key="position.positionId"
            :value="position.positionId"
          >
            {{ position.positionName }}
          </option>
        </select>

        <label>簽核人職位：</label>
        <select
          v-model="step.approverPositionId"
          class="custom-select my-1 mr-sm-2"
        >
          <option
            v-for="position in positions"
            :key="position.positionId"
            :value="position.positionId"
          >
            {{ position.positionName }}
          </option>
        </select>

        <button
          type="button"
          @click="removeStep(index)"
          class="delete-button"
          v-if="index !== 0"
        >
          刪除步驟
        </button>
      </div>

      <button type="button" @click="addStep" class="add-button">
        新增步驟
      </button>
      <button type="submit" @click="submitForm" class="submit-button">
        提交
      </button>
    </div>
    <div class="bg-white py-4"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosapi from "@/plugins/axios.js";
import Swal from "sweetalert2";

const flowName = ref("");
const approvalSteps = ref([
  { requestTypeId: "", employeePositionId: "", approverPositionId: "" },
]);

// 取得請假類型與職位
const leaveTypes = ref([]);
const positions = ref([]);

onMounted(async () => {
  try {
    const typeResponse = await axiosapi.get("/api/types/category/leave_type");
    leaveTypes.value = typeResponse.data;
    console.log(leaveTypes.value);
  } catch (error) {
    console.error("Error fetching leave types:", error);
  }
  try {
    const positionResponse = await axiosapi.get("/position/find");
    positions.value = positionResponse.data;
  } catch (error) {
    console.error("Error fetching positions:", error);
  }
});

// 新增簽核步驟（繼承第一步的請求類型與員工職位）
function addStep() {
  if (approvalSteps.value.length === 0) return;

  const firstStep = approvalSteps.value[0];
  approvalSteps.value.push({
    requestTypeId: firstStep.requestTypeId,
    employeePositionId: firstStep.employeePositionId,
    approverPositionId: "",
  });
}

// 刪除步驟
function removeStep(index) {
  approvalSteps.value.splice(index, 1);
}

// 送出表單
async function submitForm() {
  const payload = approvalSteps.value.map((step, index) => ({
    flowName: flowName.value,
    requestTypeId: step.requestTypeId,
    employeePositionId: step.employeePositionId,
    stepOrder: index + 1,
    approverPositionId: step.approverPositionId,
  }));

  try {
    const response = await axiosapi.post(
      `/api/approval/create/approval-flows`,
      payload
    );
    Swal.fire({
      title: "成功!",
      text: response.data,
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      // 跳轉到首頁
      window.location.href = "/approvalflow/create";
    });
  } catch (error) {
    // 錯誤處理
    if (error.response && error.response.data) {
      const errorMessage = error.response.data || "建立簽核流程失敗";
      Swal.fire({
        title: "錯誤!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "重新提交",
      });
    } else {
      Swal.fire({
        title: "錯誤!",
        text: "提交請假申請時發生未知錯誤",
        icon: "error",
        confirmButtonText: "重新提交",
      });
    }
  }
}
</script>

<style scoped>
/* 表單樣式 */
.form-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.input-field,
.custom-select-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

.step-group {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
}

.add-button,
.submit-button,
.delete-button {
  padding: 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-button {
  background: #4caf50;
  color: white;
}

.submit-button {
  background: #008cba;
  color: white;
}

.delete-button {
  background: #f44336;
  color: white;
}
</style>
