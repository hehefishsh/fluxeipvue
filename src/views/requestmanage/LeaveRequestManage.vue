<template>
  <div>
    <!-- 查詢請假資料 -->
    <div class="card card-default" id="leave-request-query">
      <div class="card-header">
        <h2>請假資料查詢</h2>
        <RouterLink class="btn btn-outline-primary btn-pill" to="/">返回首頁</RouterLink>
      </div>
      <div class="card-body py-0" data-simplebar>
        <!-- 顯示錯誤信息 -->
        <div v-show="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <div v-if="leaveRequestData">
          <!-- 顯示請假資料 -->
          <h4>
            <span class="badge badge-square badge-outline-primary">請假資料</span>
          </h4>
          <table class="table table-borderless table-thead-border">
            <thead>
              <tr>
                <th class="text">申請Id</th>
                <th class="text">申請人</th>
                <th class="text">請假類型</th>
                <th class="text">開始時間</th>
                <th class="text">結束時間</th>
                <th class="text">請假時數</th>
                <th class="text">請假原因</th>
                <th class="text">附件</th>
                <th class="text">狀態</th>
                <th class="text">其他</th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="(leave, index) in leaveRequestData" :key="index">
                <td class="text">{{ leave.leaveRequestId }}</td>
                <td class="text">{{ leave.employeeName }}</td>
                <td class="text">{{ leave.leaveType}}</td>
                <td class="text">{{ formatDate(leave.startDatetime) }}</td>
                <td class="text">{{ formatDate(leave.endDatetime) }}</td>
                <td class="text">{{ leave.leaveHours }}</td>
                <td class="text">{{ leave.reason }}</td>
                <td class="text">
                  <button v-if="leave.attachmentName" @click="downloadfile(leave.attachmentName,leave.attachmentPath)" class="badge badge-primary">下載附件</button>
                  <span v-else>無</span>
                  {{ leave.attachmentName }}
                </td>
                <td class="text">{{ leave.status }}</td>
                <td class="text">
                  <!-- <RouterLink :to="`/requestmanage/leave-request-details/${leave.leaveRequestId}`" >查看詳情</RouterLink> -->
                  <button class="badge badge-info" @click="showModal(leave)" data-toggle="modal" data-target="#leaveRequestModal">
                    查看詳情
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-white py-4"></div>
      </div>
    </div>
        <!-- 請假詳情 Modal -->
        <LeaveRequestDetails :leaveRequest="selectedLeaveRequest" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosapi from '@/plugins/axios.js';
import useUserStore from '@/stores/user';
import LeaveRequestDetails from './LeaveRequestDetails.vue';
const user=useUserStore();
// 用來儲存請假資料
const leaveRequestData = ref([]);
const error = ref('');

const selectedLeaveRequest = ref(null);


// 選擇請假單，傳遞給 Modal
const showModal = (leave) => {
  selectedLeaveRequest.value = leave;
};
// 查詢請假資料
onMounted(async () => {
  try {
    const response = await axiosapi.get(`/api/leave-requests/employee/${user.empId}`);
    leaveRequestData.value = response.data;
  } catch (err) {
    error.value = "無法獲取請假資料";
  }
});

// 簡單日期格式化函式，依需求調整格式
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

function downloadfile(attachmentName, attachmentPath) {
  console.log(attachmentName);
    axiosapi.get(`/api/leave-requests/attachments/${attachmentPath}`, {
        responseType: 'blob' // 確保返回的是二進制數據
    })
    .then(response => {
        // 創建 Blob 對象
        const blob = new Blob([response.data], { type: response.headers['content-type'] }); 

        // 創建下載連結
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
        Swal.fire({
            title: "下載失敗: " + error.message,
            icon: "error"
        });
    });
}



</script>

<style scoped>
設定表格固定布局
.table {
  table-layout: fixed;
  width: 100%;
}

/* 防止文字溢出並顯示省略號 */
.table td, .table th {
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* 可以根據需要設置合適的寬度 */
}


</style>
