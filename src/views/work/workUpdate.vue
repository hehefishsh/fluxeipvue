<template>
    <div class="card card-default form-container">

            <h3 class="form-title">工作內容</h3>
            工作名稱<input v-model="work.workName" placeholder="輸入名稱" class="input-field" required  />
            開始日期<input type="date" v-model="work.createDate" class="custom-select my-1 mr-sm-2 w-auto" required />
            預計完成日期<input type="date" v-model="work.expectedFinishDate" class="custom-select my-1 mr-sm-2 w-auto" required />
            完成日期<input type="date" v-model="work.finishDate" class="custom-select my-1 mr-sm-2 w-auto" required />
            狀態<select v-model="work.status" required >
                            <option v-for="sta in statusSelect"  :value="work.status">
                                {{ sta }}
                            </option>
                        </select>

            <h3 class="form-title">分配工作</h3>
            <div v-for="(content, index) in contents" :key="index" class="content-group">
                <div class="content-wrapper">
                項目名稱<input v-model="content.taskName" :placeholder="'輸入名稱 '" class="input-field" />

                工作內容<input
                    v-model="content.taskContent" 
                    :placeholder="'輸入內容 '" class="input-field" />
                            
                負責員工<select v-model="content.employee" >
                            <option v-for="emplo in empselect"  :value="emplo.employeeName">
                              {{ emplo.employeeName }}
                            </option>
                        </select>
                
                開始日期<input type="date"  v-model="content.createDate" required  />
                預計完成日期<input type="date"  v-model="content.expectedFinishDate"  required />
                完成日期<input type="date"  v-model="content.finishDate"  required />
                狀態<select v-model="content.status" required >
                    <option v-for="sta in statusSelect"  :value="content.status">
                        {{ sta }}
                    </option>
                </select>
            </div>
                <!-- 刪除按鈕 -->
                <button type="button" @click="removeField(index)" class="delete-button">X</button>
            </div>
                <!-- 新增內容按鈕 -->
                <button type="button" @click="addField" class="add-button">新增交辦事項</button>
          
                <!-- 送出按鈕 -->
                <div style="text-align: right;">
                  <button @click="submit" class="btn btn-secondary btn-pill">修改</button>
                </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router"; // 引入 useRoute
import axiosapi from "@/plugins/axios-login";
import { useRouter } from 'vue-router';
import useUserStore from '@/stores/user';
import Swal from "sweetalert2";
const route = useRoute();
const workId=route.params.id;
const user=useUserStore();
const employeeId=user.empId
const work=ref({})
const statusSelect=ref(["已完成","未完成"])

async function findWork(){
    const response=await axiosapi.get(`/work/taskassign/${workId}`);
    work.value=response.data.workprogress
    work.value.createDate=formatDate(work.value.createDate)
    work.value.expectedFinishDate=formatDate(work.value.expectedFinishDate)
    work.value.finishDate=formatDate(work.value.finishDate)
    contents.value=response.data.taskassign
    
    contents.value = response.data.taskassign.map(item => {
    // 格式化每個日期欄位
        if (item.createDate) {
            item.createDate = formatDate(item.createDate); // 將格式化後的日期設回到 item 中
        }
        if (item.expectedFinishDate) {
            item.expectedFinishDate = formatDate(item.expectedFinishDate);
        }
        if (item.finishDate) {
            item.finishDate = formatDate(item.finishDate);
        }
        return item;
    });

    console.log(contents.value)
}

// const router = useRouter();
// // 使用 useRoute 獲取當前路由
// const route = useRoute();


// **狀態管理**
const contents = ref([
    {
        taskName:"",
        taskContent: "",
        createDate: "", 
        expectedFinishDate:"",
        finishDate:"",
        employee:"" ,
        reveiew: employeeId,  
        status:"未完成",
        taskId:""
    }
]);

// async function submit() {
//   if(new Date(work.value.createDate) > new Date(work.value.expectedFinishDate)){
//     Swal.fire({
//                 title:"工作的開始日期比預計完成日期晚",
//                 icon:"warning"
//             })
//             return;
//   }
//   for (let task of contents.value) {
//       console.log(new Date(task.createDate) > new Date(task.expectedFinishDate));  // 列印每個 taskassign 的員工名稱
//       if(new Date(task.createDate) > new Date(task.expectedFinishDate)){
//         Swal.fire({
//                 title:"分配工作的開始日期比預計完成日期晚",
//                 icon:"warning"
//             })
//             return;
//           }
//     };
//     const workRequest = {
//       supervisorId: employeeId,
//       workName: work.value.workName,
//       createDate: work.value.createDate,
//       expectedFinishdate: work.value.expectedFinishDate,
//       taskassigns: contents.value,  // 這是一個對象或數組，會被自動轉換成 JSON 字符串
//     };
//     const response = await axiosapi.post("/workProgress/create", workRequest);
//     if(response.data){
//               Swal.fire({
//                   title:"新增成功",
//                   icon:"success"
//               })
//               router.push("/work/progress");
//           }else{
//               Swal.fire({
//                   title:"新增失敗",
//                   icon:"warning"
//               })
//           }
// }

// **新增欄位**
function addField() {
        contents.value.push({
            taskName:"",
            taskContent: "",
            createDate: getTodayDate(), 
            expectedFinishDate:"",
            finishDate:"",
            employee:"" ,
            reveiew: employeeId,  
            status:"未完成"
        });
    }

// **刪除欄位**
function removeField(index) {
  contents.value.splice(index, 1); // 根據 index 刪除對應的欄位
}

const empselect=ref([])
async function findEmp(){
    const dep=await axiosapi.get(`/employee/find/department/emp/${employeeId}`);
    empselect.value=dep.data
}

onMounted(function(){
    findWork()
    findEmp()
})

function formatDate(date) {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear(); // 取得年份
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0'); // 取得月份並補零
    const day = formattedDate.getDate().toString().padStart(2, '0'); // 取得日期並補零
    return `${year}-${month}-${day}`; // 返回格式化的日期字符串
};

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 月份從0開始，需加1
    const day = String(today.getDate()).padStart(2, '0'); // 使日期為兩位數

    return `${year}-${month}-${day}`;
}

</script>

<style scoped>
  /* 表單容器 */
  .form-container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  
  /* 標題樣式 */
  .form-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  /* 輸入框 */
  .input-field {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  /* 內容區塊 */
  .content-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
    padding: 5px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
  }
  /* 刪除按鈕 */
  .delete-button {
    color: red;
    text-decoration: underline;
    background: none;
    padding: 0;
    border: none;
  }

</style>
