<template>
    <div>
      <!-- 假設 header 與 leftside 由父層或全域組件處理 -->
      <!-- 內容區塊 -->
      <div>
        <!-- 頁面標題 -->
        <div class="content-title">
          員工管理
        </div>
        <!-- 內容 -->
        <div class="card card-default" id="page-views">
          <div class="card-header">
            <h2>所有員工</h2>
            <RouterLink class="btn btn-primary btn-pill" to="/employee/manage/create">
                      <span class="nav-text">新增員工</span>
            </RouterLink>
          </div>
          <div class="card-body py-0" data-simplebar>
            <div v-if="employees && employees.length">
              <table class="table table-borderless table-thead-border">
                <thead>
                  <tr>
                    <th class="text">員工ID</th>
                    <th class="text">姓名</th>
                    <th class="text">職位</th>
                    <th class="text">部門</th>
                    <th class="text">入職時間</th>
                    <th class="text">狀態</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="employee in employees" :key="employee.employeeId">
                    <td class="text">{{ employee.employeeId }}</td>
                    <td class="text">{{ employee.employeeName }}</td>
                    <!-- 注意：原 Thymeleaf 模板中部門與職位順序與表頭略有不同，這邊依原始邏輯保留 -->
                    <td class="text">{{ employee.department.departmentName }}</td>
                    <td class="text">{{ employee.position.positionName }}</td>
                    <td class="text">{{ employee.hireDate }}</td>
                    <td class="text">{{ employee.status.statusName }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="bg-white py-4"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const employees = ref([])
  
  onMounted(async () => {
    try {
      const response = await axios.get('/api/employees')
      employees.value = response.data
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  })
  </script>
  
  <!-- 保留你的樣式 -->
  <style>
  </style>
  