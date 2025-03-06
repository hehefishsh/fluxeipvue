<template>
  <!-- 假設 header 與 leftside 已由全域或父層組件處理 -->

    <div class="card card-default" id="page-views">
        <div class="card-header">
          <h2>新增會議</h2>
        </div>
        <div class="card-body py-0" data-simplebar>
          <form @submit.prevent="saveMeeting" class="form-group">
            <div class="form-group">
              <label for="employee">預約人</label>
              <select
                id="employee"
                class="form-control rounded-0"
                v-model="meeting.employee"
                required
              >
                <option
                  v-for="employee in employees"
                  :key="employee.employeeId"
                  :value="employee.employeeId"
                >
                  {{ employee.employeeName }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="room">會議室</label>
              <select
                id="room"
                class="form-control rounded-0"
                v-model="meeting.room"
                required
              >
                <option
                  v-for="room in rooms"
                  :key="room.id"
                  :value="room.id"
                >
                  {{ room.roomName }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="startTime">開始時間</label>
              <input
                type="datetime-local"
                id="startTime"
                class="form-control rounded-0"
                v-model="meeting.startTime"
                required
                @change="updateEndTime"
              >
            </div>

            <div class="form-group">
              <label for="endTime">結束時間</label>
              <input
                type="datetime-local"
                id="endTime"
                class="form-control rounded-0"
                v-model="meeting.endTime"
                required
              >
            </div>

            <div class="form-group">
              <label for="notes">備註</label>
              <input
                type="text"
                id="notes"
                class="form-control rounded-0"
                v-model="meeting.notes"
              >
            </div>

            <div class="form-footer">
              <button type="submit" class="btn btn-secondary btn-pill">Submit</button>
              <button type="button" @click="goBack" class="btn btn-light btn-pill">Cancel</button>
            </div>
          </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'

// 定義會議室預約表單資料
const meeting = reactive({
  employee: '',
  room: '',
  startTime: '',
  endTime: '',
  notes: ''
})

// 員工及會議室資料，請依需求從 API 取得
const employees = ref([])
const rooms = ref([])

onMounted(async () => {
  // 取得員工資料
  try {
    const empResponse = await axios.get('/api/employees')
    employees.value = empResponse.data
  } catch (error) {
    console.error('Error fetching employees:', error)
  }
  // 取得會議室資料
  try {
    const roomResponse = await axios.get('/api/rooms')
    rooms.value = roomResponse.data
  } catch (error) {
    console.error('Error fetching rooms:', error)
  }
})

// 更新結束時間：當開始時間變動時，自動設定結束時間為開始時間加 9 小時
function updateEndTime() {
  if (meeting.startTime) {
    const startDate = new Date(meeting.startTime)
    const endDate = new Date(startDate)
    endDate.setHours(startDate.getHours() + 9)
    meeting.endTime = endDate.toISOString().slice(0, 16)
  }
}

// 返回上一頁
function goBack() {
  window.history.back()
}

// 提交表單，將會議室預約資料送出
async function saveMeeting() {
  try {
    await axios.post('/api/meetings/save', meeting)
    // 成功後可依需求進行導向或提示訊息
  } catch (error) {
    console.error('Error saving meeting:', error)
  }
}
</script>

<style>
</style>
