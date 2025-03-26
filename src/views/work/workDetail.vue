<template>
    <div class="card card-default">
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
        </div></div>
    <div class="row">
        <div class="col-md-6 col-xl-10" v-for="taskAssign in taskAssigns" :key="taskAssign.taskId">
            <div class="card py-3 mb-4">
                <div class="card-body">
                    <h5 class="card-title" :style="getStatusStyle(taskAssign.status.statusName)">{{taskAssign.taskName}}</h5>
                    <button type="button" class="mb-1 btn btn-pill btn-info" @click="openModal(taskAssign.taskId)">編輯</button>
                    <p class="card-text pb-4 pt-1">工作內容 : {{taskAssign.taskContent}}</p>
                    <p class="card-text pb-4 pt-1">負責員工 : {{taskAssign.assign.employeeName}}</p>
                    <p class="card-text pb-4 pt-1">開始日期 : {{formatDate(taskAssign.createDate)}}</p>
                    <p class="card-text pb-4 pt-1">預計完成日期 : {{formatDate(taskAssign.expectedFinishDate)}}</p>
                    <p class="card-text pb-4 pt-1" v-if="taskAssign.finishDate==null">完成日期 : 尚未完成</p>
                    <p class="card-text pb-4 pt-1" v-if="taskAssign.finishDate!=null">完成日期 : {{formatDate(taskAssign.finishDate)}}</p>
                    <p class="card-text pb-4 pt-1">狀態 : {{taskAssign.status.statusName}}</p>
                </div>
            </div>
        </div>
    </div>
    <button class="fixed-button" @click="openModal(null)">新增交辦事項</button>
    <Taskassign ref="modal" 
                    v-model:task="task" 
                    v-model:empselect="empselect"
                    v-model:review="review"
                    :is-show-button-insert="isShowButtonInsert"
                    @update="callUpdate"
                    @deleteDate="deleteDate"
                    @reviewDate="reviewDate"
                    @insert="insert"
    ></Taskassign>
</template>
    
<script setup>
import Taskassign from "@/components/Taskassign.vue";
import { ref,onMounted } from "vue";
import { useRouter,useRoute } from "vue-router";
import axiosapi from "@/plugins/axios";
import Swal from "sweetalert2";
const router = useRouter(); // 用來跳轉頁面
const route = useRoute();
const workId = route.params.id;
const workTaskAssigns=ref({});
const work=ref({})
const taskAssigns=ref({})
const supervisor=ref("")
const empselect=ref([])

const review=ref(["未完成","已完成","待審核"])

const task=ref({})
async function callUpdate(){
    if (task.value.status == "已完成" && (task.value.finishDate == null || task.value.finishDate == '')) {
        Swal.fire({
            title: "審核完成，請輸入完成日期",
            icon: "warning"
        });
    } else if (task.value.status == "未完成" && task.value.finishDate != null) {
        Swal.fire({
            title: "完成日期已填寫，是否審核完成?",
            icon: "warning"
        });
    } else if(task.value.taskName==''){
        Swal.fire({
            title: "請輸入名稱",
            icon: "warning"
        });
    } else if(task.value.taskContent==''){
        Swal.fire({
            title: "請輸入內容",
            icon: "warning"
        });
    }else {
        task.value.reveiew=supervisor.value
        const response=await axiosapi.put(`/taskassign/${task.value.taskId}`,task.value);
        if(response){
            Swal.fire({
                title:"修改成功",
                icon:"success"
            })
            task.value=""
            findtaskAssign()
            modal.value.closeModal();
        }else{
            Swal.fire({
                title:"修改失敗",
                icon:"warning"
            })
        }
    }
}

async function insert(){
    task.value.status ="未完成"
    task.value.finishDate =null
    task.value.reveiew=supervisor.value
    console.log(task.value)
    const response=await axiosapi.post(`/taskassign/create/${workId}`,task.value);
    if(response){
            Swal.fire({
                title:"新增成功",
                icon:"success"
            })
            task.value=""
            findtaskAssign()
            modal.value.closeModal();
        }else{
            Swal.fire({
                title:"修改失敗",
                icon:"warning"
            })
        }
}

const isShowButtonInsert=ref(true);
const modal=ref(null);
async function openModal(data){
    if(data!=null){
        isShowButtonInsert.value=true
        const response=await axiosapi.get(`/taskassign/${data}`);
        task.value=response.data
        task.value.status =task.value.status.statusName
        task.value.createDate = formatDate(task.value.createDate);
        task.value.expectedFinishDate = formatDate(task.value.expectedFinishDate);
            if(task.value.finishDate!=null){
                task.value.finishDate = formatDate(task.value.finishDate);
            }
            task.value.employee=response.data.assign.employeeName
            }
    else{
        task.value={}
        task.value.status ="未完成"
        task.value.createDate =getTodayDate()
        isShowButtonInsert.value=false
    }
    modal.value.showModal();
}

async function findtaskAssign(){
    const response=await axiosapi.get(`/work/taskassign/${workId}`);
    workTaskAssigns.value=response.data
    work.value=response.data.workprogress
    taskAssigns.value=response.data.taskassign
    supervisor.value=response.data.workprogress.supervisor.employeeName
    const dep=await axiosapi.get(`/employee/find/department/${response.data.workprogress.supervisor.department.departmentName}`);
    empselect.value=dep.data
}

function reviewDate(){
    if(task.value.status=="已完成"){
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 月份從0開始，所以需要加1，並補零
        const day = today.getDate().toString().padStart(2, '0'); // 補零以保持格式一致
        task.value.finishDate= `${year}-${month}-${day}`; // 格式：YYYY-MM-DD
    }else{
        deleteDate();
    }
}

function deleteDate(){
    task.value.finishDate=''
}

onMounted(function(){
    findtaskAssign()
})
function formatDate(date) {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear(); // 取得年份
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0'); // 取得月份並補零
    const day = formattedDate.getDate().toString().padStart(2, '0'); // 取得日期並補零
    return `${year}-${month}-${day}`; // 返回格式化的日期字符串
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
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // 月份從0開始，需加1
        const day = String(today.getDate()).padStart(2, '0'); // 使日期為兩位數

    return `${year}-${month}-${day}`;
}
</script>
    
<style>
.fixed-button {
    position: fixed;
    bottom: 20px; /* 按鈕離底部 20px */
    right: 20px;  /* 按鈕離右邊 20px */
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 10%;
    /* font-size: 16px; */
    cursor: pointer;
    /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); */
    transition: background-color 0.3s ease;
}
</style>