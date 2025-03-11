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
                    <input type="text" id="employee" class="form-control rounded-0" v-model="currentEmployeeName"
                        readonly />
                </div>

                <!-- 請假類型 -->
                <div class="form-group">
                    <label for="leaveType">請假類型</label>
                    <select id="leaveType" class="form-control rounded-0" v-model="leaveRequest.leaveType" required>
                        <option v-for="type in leaveTypes" :key="type.id" :value="type.id">
                            {{ type.typeName }}
                        </option>
                    </select>
                </div>

                <!-- 開始時間 -->
                <div class="form-group">
                    <label for="startTime">開始時間</label>
                    <input type="datetime-local" id="startTime" class="form-control rounded-0"
                        v-model="leaveRequest.startTime" required @change="updateLeaveHours" />
                </div>

                <!-- 結束時間 -->
                <div class="form-group">
                    <label for="endTime">結束時間</label>
                    <input type="datetime-local" id="endTime" class="form-control rounded-0"
                        v-model="leaveRequest.endTime" required @change="updateLeaveHours" />
                </div>
                <!-- 請假時數 -->
                <div class="form-group">
                    <label for="leaveHours">請假時數</label>
                    <div class="input-group">
                        <input type="number" id="leaveDays" class="form-control rounded-0"
                            v-model="leaveRequest.leaveDays" placeholder="天數" />
                        <span class="input-group-text">天</span>

                        <input type="number" id="leaveHours" class="form-control rounded-0"
                            v-model="leaveRequest.leaveHours" placeholder="小時" />
                        <span class="input-group-text">小時</span>
                    </div>
                </div>

                <!-- 可以簽核的人 -->
                <div class="form-group">
                    <label for="approver">選擇簽核人</label>
                    <select id="approver" class="form-control rounded-0" v-model="leaveRequest.approver" required>
                        <option v-for="approver in approvers" :key="approver.employeeId" :value="approver.employeeId">
                            {{ approver.employeeName }}
                        </option>
                    </select>
                </div>
                <!-- 請假原因 -->
                <div class="form-group">
                    <label for="reason">請假原因</label>
                    <textarea id="reason" class="form-control rounded-0" v-model="leaveRequest.reason"
                        required></textarea>
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
  leaveType: '',
  startTime: '',
  endTime: '',
  leaveHours: 0,
  reason: '',
  attachments: null
})

// 取得請假類型
const leaveTypes = ref([])
// 儲存簽核人員的列表
const approvers = ref([]) 

onMounted(async () => {
  try {
    // 取得請假類型清單
    const typeResponse = await axiosapi.get('/api/types/category/leave_type')
    console.log('後端回傳的請假類型:', typeResponse.data) // **檢查 API 回傳的數據**
    leaveTypes.value = typeResponse.data
    // 根據當前使用者，取得可簽核的人員清單
    const approverResponse = await axios.get(`/api/approvers/${currentEmployeeId.value}`)
    approvers.value = approverResponse.data
  } catch (error) {
    console.error('Error fetching leave types:', error)
  }
})

// 計算請假時數
function updateLeaveHours() {
  if (leaveRequest.startTime && leaveRequest.endTime) {
    const start = new Date(leaveRequest.startTime)
    const end = new Date(leaveRequest.endTime)
    const diffTime = (end - start) / (1000 * 60 * 60) // 總時數差異

    // 計算天數
    leaveRequest.leaveDays = Math.floor(diffTime / 8) // 每天計算 8 小時

    // 計算剩餘的小時數並將其轉換為半小時為單位，無條件進位
    const remainingHours = diffTime % 8 // 剩餘的時數
    leaveRequest.leaveHours = (Math.ceil(remainingHours * 2) / 2).toFixed(1) // 無條件進位至最接近的半小時
  }
}


// 處理附件上傳
function handleFileUpload(event) {
  leaveRequest.attachments = event.target.files[0]
}

// 提交請假申請
async function submitLeaveRequest() {
  const formData = new FormData()
  formData.append('employee_id', leaveRequest.employee_id)
  formData.append('leave_type_id', leaveRequest.leaveType)
  formData.append('start_datetime', leaveRequest.startTime)
  formData.append('end_datetime', leaveRequest.endTime)
  formData.append('leave_hours', leaveRequest.leaveHours)
  formData.append('reason', leaveRequest.reason)
  if (leaveRequest.attachments) {
    formData.append('attachments', leaveRequest.attachments)
  }

  try {
    await axios.post('/api/leave-requests/save', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    alert('請假申請提交成功！')
  } catch (error) {
    console.error('Error submitting leave request:', error)
  }
}

// 返回上一頁
function goBack() {
  window.history.back()
}
</script>
