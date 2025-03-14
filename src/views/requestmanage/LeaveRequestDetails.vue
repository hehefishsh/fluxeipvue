<template>
  <div class="modal fade" id="leaveRequestModal" tabindex="-1" role="dialog" aria-labelledby="leaveRequestModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">請假詳情</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
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
                  <td>{{ leaveRequest.employeeName }}</td>
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
                <tr>
                  <td>狀態</td>
                  <td>{{ leaveRequest.status }}</td>
                </tr>
                <tr v-if="leaveRequest.attachmentName">
                  <td>附件</td>
                  <td>
                    <button v-if="leaveRequest.attachmentName" @click="downloadfile(leaveRequest.attachmentName, leaveRequest.attachmentPath)" class="badge badge-primary">
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
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger btn-pill" data-dismiss="modal">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

// 接收父組件傳來的請假資料
const props = defineProps({
  leaveRequest: Object
});

// 簡單日期格式化函式
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
};

// 下載附件的函數
function downloadfile(attachmentName, attachmentPath) {
  axiosapi.get(`/api/leave-requests/attachments/${attachmentPath}`, { responseType: 'blob' })
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
