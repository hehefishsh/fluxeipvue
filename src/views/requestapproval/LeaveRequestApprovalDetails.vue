<template>
  <!-- 請假詳情 Modal -->
  <div v-if="leaveRequest" class="modal fade" id="leaveRequestModal" tabindex="-1"
    aria-labelledby="leaveRequestModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="leaveRequestModalLabel">請假詳情</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="leaveRequest">
            <table class="table table-borderless ">
              <tbody>
                <tr>
                  <td>申請Id</td>
                  <td>{{ leaveRequest.leaveRequestId }}</td>
                </tr>
                <tr>
                  <td>申請人</td>
                  <td>{{ leaveRequest.requestEmployeeName }}</td>
                </tr>
                <tr>
                  <td>請假類型</td>
                  <td>{{ leaveRequest.leaveType }}</td>
                </tr>
                <tr>
                  <td>開始時間</td>
                  <td>{{ formatDate(leaveRequest.startDatetime) }}</td>
                </tr>
                <tr>
                  <td>結束時間</td>
                  <td>{{ formatDate(leaveRequest.endDatetime) }}</td>
                </tr>
                <tr>
                  <td>請假時數</td>
                  <td>{{ leaveRequest.leaveHours }}</td>
                </tr>
                <tr>
                  <td>請假原因</td>
                  <td>{{ leaveRequest.reason }}</td>
                </tr>
                <!-- <tr>
                  <td>狀態</td>
                  <td>{{ leaveRequest.status }}</td>
                </tr> -->
                <tr v-if="leaveRequest.attachmentName">
                  <td>附件</td>
                  <td>
                    <button v-if="leaveRequest.attachmentName"
                      @click="downloadfile(leaveRequest.attachmentName, leaveRequest.attachmentPath)"
                      class="badge badge-primary">
                      下載附件
                    </button>
                    <span v-else>無</span>
                    {{ leaveRequest.attachmentName }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p>正在加載請假詳情...</p>
          </div>
          <!-- <p><strong>申請人：</strong>{{ leaveRequest.requestEmployeeName }}</p>
          <p><strong>請假類型：</strong>{{ leaveRequest.leaveType }}</p>
          <p><strong>開始時間：</strong>{{ formatDate(leaveRequest.startDatetime) }}</p>
          <p><strong>結束時間：</strong>{{ formatDate(leaveRequest.endDatetime) }}</p>
          <p><strong>請假時數：</strong>{{ leaveRequest.leaveHours }}</p>
          <p><strong>請假原因：</strong>{{ leaveRequest.reason }}</p>
          <p><strong>附件：</strong>
            <button v-if="leaveRequest.attachmentName" @click="downloadfile(leaveRequest.attachmentName, leaveRequest.attachmentPath)" class="badge badge-primary">下載附件</button>
            <span v-else>無</span>
          </p> -->
        </div>
        <div class="modal-footer">
          <button v-if="actionType === 'approve'" class="btn btn-success" @click="approveLeave">
            核准
          </button>
          <button v-if="actionType === 'reject'" class="btn btn-warning" @click="rejectLeave">
            否決
          </button>
          <button class="btn btn-secondary" @click="closeModal">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axiosapi from '@/plugins/axios.js';

// 透過 props 接收 selectedLeaveRequest
const props = defineProps({
  leaveRequest: Object,
  actionType: String
});

const closeModal = () => {
  props.leaveRequest = null;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short", // 週日, 週一等
  };
  return new Intl.DateTimeFormat("zh-TW", options).format(date).replace(',', ''); // 替換逗號
};

function downloadfile(attachmentName, attachmentPath) {
  axiosapi.get(`/api/leave-requests/attachments/${attachmentPath}`, {
    responseType: 'blob' // 確保返回的是二進制數據
  })
  .then(response => {
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = decodeURIComponent(attachmentName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  })
  .catch(error => {
    console.error("下載失敗", error);
  });
}
</script>

<style scoped>
.modal-content {
  max-width: 600px;
}
</style>
