<template>
    <div class="row">
    <div class="col">
        項目名 : {{work.workName}}
    </div>
    <div class="col">
        創建日期 : {{formatDate(work.createDate)}}
    </div>
    <div class="col">
        預計完成日期 : {{formatDate(work.expectedFinishDate)}}
    </div>
    <div class="col">
        完成日期 : {{formatDate(work.finishDate)}}
    </div>
    <div class="col">
        負責主管 : {{supervisor}}
    </div>
        <div class="col-md-6 col-xl-10" v-for="taskAssign in taskAssigns" :key="taskAssign.taskId">
            <div class="card py-3 mb-4">
                <div class="card-body">
                    <h5 class="card-title" :style="getStatusStyle(taskAssign.status.statusName)">{{taskAssign.taskName}}</h5>
                    <button type="button" class="mb-1 btn btn-pill btn-info" @click="openModal(taskAssign.taskId)">編輯</button>
                    <p class="card-text pb-4 pt-1">工作內容 : {{taskAssign.taskContent}}</p>
                    <p class="card-text pb-4 pt-1">負責員工 : {{taskAssign.assign.employeeName}}</p>
                    <p class="card-text pb-4 pt-1">創建日期 : {{formatDate(taskAssign.createDate)}}</p>
                    <p class="card-text pb-4 pt-1">預計完成日期 : {{formatDate(taskAssign.expectedFinishDate)}}</p>
                    <p class="card-text pb-4 pt-1" v-if="taskAssign.finishDate==null">完成日期 : 尚未完成</p>
                    <p class="card-text pb-4 pt-1" v-if="taskAssign.finishDate!=null">完成日期 : {{formatDate(taskAssign.finishDate)}}</p>
                    <p class="card-text pb-4 pt-1">狀態 : {{taskAssign.status.statusName}}</p>
                </div>
            </div>
        </div>
    </div>

    <Taskassign ref="modal" 
                    v-model:task="task" 
                    v-model:emp="employee"
                    @update="callUpdate"
    ></Taskassign>
</template>
    
<script setup>
import Taskassign from "@/components/Taskassign.vue";
import { ref,onMounted } from "vue";
import { useRouter,useRoute } from "vue-router";
import axiosapi from "@/plugins/axios";
const router = useRouter(); // 用來跳轉頁面
const route = useRoute();
const workId = route.params.id;
const workTaskAssigns=ref({});
const work=ref({})
const taskAssigns=ref({})
const supervisor=ref("")

const task=ref({})
function callUpdate(){

}
const employee=ref("")
const modal=ref(null);
async function openModal(data){
    const response=await axiosapi.get(`/taskassign/${data}`);
    task.value=response.data
    employee.value=response.data.assign.employeeName
    console.log(task.value)
    modal.value.showModal();
}

async function findtaskAssign(){
    const response=await axiosapi.get(`/work/taskassign/${workId}`);
    workTaskAssigns.value=response.data
    work.value=response.data.workprogress
    taskAssigns.value=response.data.taskassign
    supervisor.value=response.data.workprogress.supervisor.employeeName
}

onMounted(function(){
    findtaskAssign()
})
function formatDate(date) {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear(); // 取得年份
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0'); // 取得月份並補零
    const day = formattedDate.getDate().toString().padStart(2, '0'); // 取得日期並補零
    return `${year}/${month}/${day}`; // 返回格式化的日期字符串
};
function getStatusStyle(statusName) {
    if (statusName === '未完成') {
        return { color: 'red' };
    } else if (statusName === '已完成') {
        return { color: 'green' };
    } else if (statusName === '待審核') {
        return { color: 'blue' };
    }
    return {}; // 預設無顏色
  }
</script>
    
<style>
    .card {
    max-width: 100%; /* 卡片最大寬度 */
    margin: 10px 0; /* 可選：上下邊距 */
}

.card-body {
    max-height: 300px; /* 固定卡片內容區域的最大高度 */
    overflow-y: auto; /* 啟用垂直滾動條 */
    padding: 10px;
}
</style>