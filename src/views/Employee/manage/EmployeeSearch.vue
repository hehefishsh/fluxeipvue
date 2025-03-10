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
            部門查詢<select id="departmentId" v-model="department"
                            required @change="dochange(department)">
                            <option v-for="department in departments" :key="department.departmentName" :value="department.departmentName">
                                {{ department.departmentName }}
                            </option>
                        </select>
            <RouterLink class="btn btn-primary btn-pill" to="/employee/manage/create">
                      <span class="nav-text">新增員工</span>
            </RouterLink>
          </div>
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
                    <td class="text">{{ formatDate(employee.hireDate) }}</td>
                    <td class="text">{{ employee.status.statusName }}</td>
                  </tr>
                </tbody>
              </table>
            <!-- </div> -->
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
          <div class="bg-white py-4"></div>
        </div>
      </div>
    </div>
  </template>
  
<script setup>

// npm install vuejs-paginate-next       vue要安裝插件
import Paginate from "vuejs-paginate-next";
import { ref, onMounted } from 'vue'
import axiosapi from "@/plugins/axios";
const current=ref(1);//目前在第幾頁
const pages=ref(0);  //總共幾頁
const total=ref(0);  //總共幾筆
const rows=ref(5);   //一頁要幾筆
const start=ref(0);  //從第幾筆開始
const employees=ref({})

const department=ref("");
const departments = ref([]);
async function departmentFind(){
    try {
    const response = await axiosapi.get("/department/find");  
    departments.value = response.data;  
    } catch (error) {
    console.error("獲取部門資料失敗:", error);
    }
}

function dochange(department){
  empFind(page)
  console.log(department)
}

async function empFind(page){
  if(page){
        current.value=page
        // start.value=rows.value*(current.value-1)
    }
  const data={
      "current":current.value-1,
      "rows":rows.value,
      "department":department.value
  };
  try{
      const response=await axiosapi.post("/employee/find",data);
      employees.value=response.data.list.content;
      total.value=response.data.count;
      pages.value=Math.ceil(total.value/rows.value);
      // lastPageRows.value=total.value % rows.value
      // console.log(employees.value.array)
  }catch(error){
      console.log("error",error);
      // Swal.fire({
      //     title:"失敗"+error.message,
      //     icon:"error"
      // })
  }
};

function formatDate(date) {
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear(); // 取得年份
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0'); // 取得月份並補零
  const day = formattedDate.getDate().toString().padStart(2, '0'); // 取得日期並補零
  return `${year}/${month}/${day}`; // 返回格式化的日期字符串
    };

onMounted(function(){
  empFind();
  departmentFind();
})
</script>

<!-- 保留你的樣式 -->
<style>
</style>
