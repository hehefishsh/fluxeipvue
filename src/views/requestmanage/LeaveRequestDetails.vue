<template>
  <div>
    <div v-if="leaveRequest">
      <h2>請假詳情</h2>
      <table class="table">
        <tr>
          <th>申請Id</th>
          <td>{{ leaveRequest.leaveRequestId }}</td>
        </tr>
        <tr>
          <th>申請人</th>
          <td>{{ leaveRequest.employeeName }}</td>
        </tr>
        <tr>
          <th>請假類型</th>
          <td>{{ leaveRequest.leaveType }}</td>
        </tr>
        <tr>
          <th>開始時間</th>
          <td>{{ formatDate(leaveRequest.startDatetime) }}</td>
        </tr>
        <tr>
          <th>結束時間</th>
          <td>{{ formatDate(leaveRequest.endDatetime) }}</td>
        </tr>
        <tr>
          <th>請假時數</th>
          <td>{{ leaveRequest.leaveHours }}</td>
        </tr>
        <tr>
          <th>請假原因</th>
          <td>{{ leaveRequest.reason }}</td>
        </tr>
        <tr>
          <th>狀態</th>
          <td>{{ leaveRequest.status }}</td>
        </tr>
        <tr v-if="leaveRequest.attachmentName">
          <th>附件</th>
          <td>
            <button @click="downloadfile(leaveRequest.attachmentName, leaveRequest.attachmentPath)" class="badge badge-primary">下載附件</button>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>
      <p>正在加載請假詳情...</p>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosapi from '@/plugins/axios.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const leaveRequest = ref(null);

// 根據請假 ID 查詢詳細資料
onMounted(async () => {
  const leaveRequestId = route.params.id; // 從路由參數中獲取 ID
  console.log(route.params.id);
  try {
    const response = await axiosapi.get(`/api/leave-requests/${leaveRequestId}`);
    leaveRequest.value = response.data;
  } catch (error) {
    console.error("無法獲取請假詳情", error);
  }
});

// 簡單日期格式化函式
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "long",
  };
  return new Intl.DateTimeFormat("zh-TW", options).format(date);
};

// 下載附件的函數
function downloadfile(attachmentName, attachmentPath) {
  axiosapi.get(`/api/leave-requests/attachments/${attachmentPath}`, {
    responseType: 'blob'
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
