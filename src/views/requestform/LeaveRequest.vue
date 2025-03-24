<template>
  <div class="card card-default" id="leave-request">
    <div class="card-header">
      <h2>請假申請</h2>
    </div>
    <div class="card-body py-0" data-simplebar>
      <form @submit.prevent="submitLeaveRequest" class="form-group">
        <!-- 申請人 -->
        <div class="form-group">
          <label for="employee">申請人</label>
          <input type="text" id="employee" class="form-control rounded-0" v-model="currentEmployeeName" readonly />
        </div>

        <!-- 請假類型 -->
        <div class="form-group">
          <label for="leaveType">請假類型</label>
          <select id="leaveType" class="form-control rounded-0" v-model="leaveRequest.leaveTypeId" required>
            <option v-for="type in leaveTypes" :key="type.id" :value="type.id">
              {{ type.typeName }}
            </option>
          </select>
        </div>

        <!-- 開始時間 -->
        <div class="form-group">
          <label for="startTime">開始時間</label>
          <input type="datetime-local" id="startTime" class="form-control rounded-0" v-model="leaveRequest.startTime"
            required @change="updateLeaveHours" />
        </div>

        <!-- 結束時間 -->
        <div class="form-group">
          <label for="endTime">結束時間</label>
          <input type="datetime-local" id="endTime" class="form-control rounded-0" v-model="leaveRequest.endTime"
            required @change="updateLeaveHours" />
        </div>

        <!-- 請假時數 -->
        <div class="form-group">
          <label for="leaveHours">請假時數</label>
          <div class="input-group">
            <input type="number" id="leaveHours" class="form-control rounded-0" v-model="leaveRequest.leaveHours"
              placeholder="小時" />
            <span class="input-group-text">小時</span>
          </div>
        </div>


        <!-- 請假原因 -->
        <div class="form-group">
          <label for="reason">請假原因</label>
          <textarea id="reason" class="form-control rounded-0" v-model="leaveRequest.reason" required></textarea>
        </div>

        <!-- 附件 -->
        <div class="form-group">
          <label for="attachments">附件</label>
          <input type="file" id="attachments" class="form-control rounded-0" @change="handleFileUpload" />
        </div>

        <!-- 按鈕區 -->
        <div class="form-footer">
          <button type="submit" class="btn btn-secondary btn-pill">提交</button>
          <button type="button" @click="goBack" class="btn btn-light btn-pill">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import axiosapi from '@/plugins/axios.js'
import useUserStore from '@/stores/user.js'

// 取得使用者資訊
const userStore = useUserStore()
const currentEmployeeName = computed(() => userStore.empName)
const currentEmployeeId = computed(() => userStore.empId) // 假設有 empId

// 表單資料
const leaveRequest = reactive({
  employee_id: currentEmployeeId.value, // 自動填入使用者 ID
  leaveTypeId: null,
  startTime: '',
  endTime: '',
  leaveHours: 0,
  reason: '',
  attachments: null
})

// 取得請假類型
const leaveTypes = ref([])

onMounted(async () => {
  try {
    // 取得請假類型清單
    const typeResponse = await axiosapi.get('/api/types/category/leave_type')
    leaveTypes.value = typeResponse.data
  } catch (error) {
    console.error('Error fetching leave types:', error)
  }
})

// 計算請假時數
function updateLeaveHours() {
  if (!leaveRequest.startTime || !leaveRequest.endTime) return;

  const start = new Date(leaveRequest.startTime);
  const end = new Date(leaveRequest.endTime);

  let totalHours = 0;
  let current = new Date(start);

  while (current < end) {
    let workStart = new Date(current);
    workStart.setHours(8, 0, 0, 0); // 08:00 上班
    let workEnd = new Date(current);
    workEnd.setHours(17, 0, 0, 0); // 17:00 下班

    // 計算當前工作日的結束時間
    let dayEnd = new Date(workEnd);
    if (current.getDate() !== end.getDate()) {
      dayEnd.setHours(17, 0, 0, 0); // 不是同一天，則算到17:00
    } else {
      dayEnd = end; // 是同一天，則算到請假結束時間
    }

    // 計算當前請假時數
    if (current < workEnd) {
      // 確保請假開始時間不早於上班時間
      let actualStart = current < workStart ? workStart : current;
      let hours = (dayEnd - actualStart) / (1000 * 60 * 60); // 計算小時數
      hours = Math.max(0, Math.min(hours, 8)); // 每天最多8小時
      totalHours += Math.floor(hours * 2) / 2; // 以30分鐘為單位計算
    }

    // 跳到下一個工作日
    current.setDate(current.getDate() + 1);
    current.setHours(8, 0, 0, 0); // 跳到下一個工作日的08:00
  }

  // 確保請假時數不會多出0.5小時
  leaveRequest.leaveHours = Math.floor(totalHours * 2) / 2 - 0.5; // 確保以30分鐘為單位
}



// 處理附件上傳
function handleFileUpload(event) {
  leaveRequest.attachments = event.target.files[0]
}

// 提交請假申請
import Swal from 'sweetalert2';

async function submitLeaveRequest() {
  const formData = new FormData();

  // 添加其他表單欄位資料
  formData.append('employeeId', leaveRequest.employee_id);
  formData.append('leaveTypeId', leaveRequest.leaveTypeId);
  formData.append('startDatetime', leaveRequest.startTime);
  formData.append('endDatetime', leaveRequest.endTime);
  formData.append('leaveHours', leaveRequest.leaveHours);
  formData.append('statusId', 4);  // 假設 4 是申請中的狀態 ID
  formData.append('reason', leaveRequest.reason);

  // 添加附件檔案
  if (leaveRequest.attachments) {
    formData.append('attachments', leaveRequest.attachments);
  }

  try {
    // 使用 FormData 發送請求
    await axiosapi.post('/api/leave-requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // 成功後顯示提示
    Swal.fire({
      title: '成功!',
      text: '請假申請提交成功！',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      // 跳轉到首頁
      window.location.href = '/';
    })
  } catch (error) {
    // 錯誤處理
    if (error.response && error.response.data) {
      const errorMessage = error.response.data || '提交失敗';
      Swal.fire({
        title: '錯誤!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: '重新提交'
      });
    } else {
      Swal.fire({
        title: '錯誤!',
        text: '提交請假申請時發生未知錯誤',
        icon: 'error',
        confirmButtonText: '重新提交'
      });
    }
  }
}



// 返回上一頁
function goBack() {
  window.history.back()
}
</script>
