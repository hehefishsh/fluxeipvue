<template>
    <table>
      <thead>
        <tr>
          <th>年月</th>
          <th>總工時</th>
          <th>加班時數</th>
          <th>遲到時數</th>
          <th>早退時數</th>
          <th>請假時數</th>
          <th>健保</th>
          <th>勞保</th>
          <th>獎金/津貼</th>
          <th>年終獎金</th>
          <th>實得薪資</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="detail in salaryDetails" :key="detail.salaryDetailId">
          <td>{{ detail.yearMonth }}</td>
          <td>{{ detail.monthlyRegularHours }}</td>
          <td>{{ detail.overtimeHours }}</td>
          <td>{{ detail.lateHours / 2 }}</td>
          <td>{{ detail.earlyLeaveHours / 2 }}</td>
          <td>{{ detail.leaveDays }}</td>
          <td>{{ detail.healthInsurance }}</td>
          <td>{{ detail.laborInsurance }}</td>
          <td>
            <ul>
              <li v-for="bonus in detail.bonuses" :key="bonus.salaryBonusId">
                {{ bonus.bonusType }}: {{ bonus.amount }}
              </li>
            </ul>
          </td>
          <td>{{ detail.yearEnd }}</td>
          <td>{{ detail.earnedSalary }}</td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  const path = import.meta.env.VITE_API_URL;
  import useUserStore from "@/stores/user";
  const userStore=useUserStore()

  const salaryDetails = ref([]);
  
  const fetchSalaryDetails = async () => {
    try {
      const response = await axios.get(`${path}/api/salary/detail/${userStore.empId}`);
      salaryDetails.value = response.data;
    } catch (error) {
      console.error('獲取薪資明細失敗', error);
    }
  };
  
  onMounted(fetchSalaryDetails);
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
  </style>
  