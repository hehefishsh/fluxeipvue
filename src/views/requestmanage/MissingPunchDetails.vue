<template>
  <div class="modal fade" id="missingPunchRequestModal" tabindex="-1" role="dialog"
    aria-labelledby="missingPunchRequestModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">補卡申請詳情</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="missingPunchRequest">
            <table class="table table-borderless">
              <tbody>
                <tr>
                  <td>申請Id</td>
                  <td>{{ missingPunchRequest.missingPunchRequestId }}</td>
                </tr>
                <tr>
                  <td>申請人</td>
                  <td>{{ missingPunchRequest.employeeName }}</td>
                </tr>
                <tr>
                  <td>補卡類型</td>
                  <td>{{ missingPunchRequest.clockType }}</td>
                </tr>
                <tr>
                  <td>缺卡日期</td>
                  <td>{{ formatDate(missingPunchRequest.missingDate) }}</td>
                </tr>
                <tr>
                  <td>原因</td>
                  <td>{{ missingPunchRequest.reason }}</td>
                </tr>
                <tr>
                  <td>狀態</td>
                  <td>{{ missingPunchRequest.status }}</td>
                </tr>
              </tbody>
            </table>

            <!-- 顯示審核步驟 -->
            <div>
              <h5 class="badge badge-secondary">審核流程</h5>
            </div>

            <table class="table table-borderless">
              <thead>
                <tr>
                  <th style="width: 12%">步驟</th>
                  <th>審核人</th>
                  <th>狀態</th>
                  <th>意見</th>
                  <th style="width: 40%">更新時間</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="step in approvalSteps" :key="step.stepId">
                  <td>{{ step.currentStep }}</td>
                  <td>{{ step.approverName }}</td>
                  <td>{{ step.status }}</td>
                  <td>{{ step.comment || "無" }}</td>
                  <td>{{ formatDate(step.updatedAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p>正在加載加減班詳情...</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axiosapi from "@/plugins/axios";

const props = defineProps({
  missingPunchRequest: Object,
});

const approvalSteps = ref([]);

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const fetchApprovalSteps = async () => {
  if (!props.missingPunchRequest) return;
  try {
    const response = await axiosapi.get(
      `/api/approval/missingpunch/steps/${props.missingPunchRequest.missingPunchRequestId}`
    );
    approvalSteps.value = response.data;
  } catch (error) {
    console.error("取得審核步驟失敗", error);
  }
};

watch(
  () => props.missingPunchRequest,
  (newVal) => {
    if (newVal) fetchApprovalSteps();
  }
);
</script>

<style scoped>
.table {
  table-layout: fixed;
  width: 100%;
}

.table td,
.table th {
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
</style>
