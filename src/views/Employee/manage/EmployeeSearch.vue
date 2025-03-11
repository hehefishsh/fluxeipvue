<template>
    <div>
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
          <Paginate :first-last-button="true"
                        first-button-text="&lt;&lt;"
                        last-button-text="&gt;&gt;"
                        :prev-text="'Prev'"
                        :nextText="'Next'"
                        :click-handler="empFind"
                        :page-range="3"
                        :margin-pages="2"
                        :inital-page="current"
                        v-model="current"
                        :pageCount="pages"
                        >
            </Paginate>
          <div class="card-body py-0" data-simplebar>
            <!-- <div v-if="employees && employees.length"> -->
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
                    <td class="text">{{ employee.department.departmentName }}</td>
                    <td class="text">{{ employee.position.positionName }}</td>
                    <td class="text">{{ employee.hireDate }}</td>
                    <td class="text">{{ employee.status.statusName }}</td>
                  </tr>
                </tbody>
              </table>
            <!-- </div> -->
          </div>
          <div class="bg-white py-4"></div>
        </div>
      </div>
    </div>
  </template>
  
<script setup>

// npm install vuejs-paginate-next       vue要安裝插件
import Paginate from "vuejs-paginate-next";
import { ref, onMounted } from 'vue'
import axiosapi from "@/plugins/axios-login";
const current=ref(1);//目前在第幾頁
const pages=ref(0);  //總共幾頁
const total=ref(0);  //總共幾筆
const rows=ref(5);   //一頁要幾筆
const start=ref(0);  //從第幾筆開始
const employees=ref({})

async function empFind(page){
  if(page){
        current.value=page
        start.value=rows.value*(current.value-1)
    }else{
        current.value=1
        start.value=0
    }
  const data={
      "start":start.value,
      "rows":rows.value
  };
  try{
      const response=await axiosapi.post("/employee/find",data);
      employees.value=response.data.content;
      // total.value=response.data.count;
      // pages.value=Math.ceil(total.value/rows.value);
      // lastPageRows.value=total.value % rows.value
      console.log(employees.value)
  }catch(error){
      console.log("error",error);
      // Swal.fire({
      //     title:"失敗"+error.message,
      //     icon:"error"
      // })
  }
}

onMounted(function(){
  empFind();
})
</script>

<!-- 保留你的樣式 -->
<style>
</style>
