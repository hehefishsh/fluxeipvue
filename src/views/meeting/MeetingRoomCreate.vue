<template>
    <div>
      <!-- 假設 header 與 leftside 由全域或父層組件處理，此處只包含內容區塊 -->
      <!-- 內容標題 -->
      <div>
        <h2>會議室管理</h2>
      </div>
      <!-- 內容區塊 -->
      <div class="card card-default" id="page-views">
        <div class="card-header">
          <h2>會議室管理</h2>
          <a href="/meetings/new" class="btn btn-primary btn-pill">預約會議室</a>
        </div>
        <div class="card-body py-0" data-simplebar>
          <div v-if="meetings && meetings.length">
            <table class="table table-borderless table-thead-border">
              <thead>
                <tr>
                  <th class="text">預約人</th>
                  <th class="text">會議室</th>
                  <th class="text">開始時間</th>
                  <th class="text">結束時間</th>
                  <th class="text">備註</th>
                  <th class="text">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="meeting in meetings" :key="meeting.id">
                  <td class="text">{{ meeting.employee.employeeName }}</td>
                  <td class="text">{{ meeting.room.roomName }}</td>
                  <td class="time-column text">{{ formatDate(meeting.startTime) }}</td>
                  <td class="time-column text">{{ formatDate(meeting.endTime) }}</td>
                  <td class="note-column text">{{ meeting.notes }}</td>
                  <td class="btn-group">
                    <a class="btn btn-danger btn-sm" style="color: white" :href="'/meetings/delete/' + meeting.id">刪除</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="bg-white py-4"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const meetings = ref([])
  
  const fetchMeetings = async () => {
    try {
      const response = await axios.get('/api/meetings')
      meetings.value = response.data
    } catch (error) {
      console.error('Error fetching meetings:', error)
    }
  }
  
  onMounted(() => {
    fetchMeetings()
  })
  
  // 格式化日期為 yyyy-MM-dd HH:mm 格式
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }
  </script>
  
  <style>
  @import url('/css/style.css');
  /* 其他插件的 CSS 請於 index.html 或全域樣式中引入 */
  </style>
  