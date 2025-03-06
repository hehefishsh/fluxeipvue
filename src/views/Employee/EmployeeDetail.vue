<template>
    <div class="container">
      <h3>個人資料</h3>
      <div class="row" v-if="employee">
        <table>
          <tr>
            <th>員工ID</th>
            <td>{{ employee.employeeId }}</td>
          </tr>
          <tr>
            <th>姓名</th>
            <td>{{ employee.employeeName }}</td>
          </tr>
          <tr>
            <th>職位</th>
            <td>{{ employee.position?.positionName }}</td>
          </tr>
          <tr>
            <th>部門</th>
            <td>{{ employee.department?.departmentName }}</td>
          </tr>
          <tr>
            <th>入職時間</th>
            <td>{{ employee.hireDate }}</td>
          </tr>
          <tr>
            <th>狀態</th>
            <td>{{ employee.status?.statusName }}</td>
          </tr>
        </table>
      </div>
      <div v-else>
        <p>載入中...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const employee = ref(null);
  
  onMounted(async () => {
    try {
      const response = await axios.get('/api/employee');
      employee.value = response.data;
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  });
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  th {
    background-color: #f4f4f4;
    text-align: left;
  }
  </style>