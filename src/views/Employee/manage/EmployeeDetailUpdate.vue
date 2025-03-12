<template>
    <div class="container">
        <h3>個人資料修改</h3>
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
        <div class="row" v-if="employee">
        <img :src="employee.employeePhoto" alt="User Image" />
        <label for="file">修改照片:</label>
    <!-- <input type="file" id="file" name="file" accept="image/*" @change="handleFileUpload()"/> -->
        <table >
            <tbody>
            <tr>
                <td>ID</td>
                <td><input type="text" id="employeeId" v-model="employee.employeeId" readonly/>{{ employee.employeeId }}</td>
            </tr>
            <tr>
                <td>姓名</td>
                <td>{{ employee.employeeName }}</td>
            </tr>
            <tr>
                <td>部門</td>
                <td>{{ employee.department }}</td>
            </tr>
            <tr>
                <td>職位</td>
                <td>{{ employee.position }}</td>
            </tr>
            <tr>
                <td>入職日</td>
                <td>{{ formatDate(employee.hireDate) }}</td>
            </tr>
            <tr>
                <td>性別</td>
                <td>{{ employee.gender }}</td>
            </tr>
            <tr>
                <td>生日</td>
                <td>{{ formatDate(employee.birthday) }}</td>
            </tr>
            <tr>
                <td>身分證</td>
                <td>{{ employee.identityCard }}</td>
            </tr>
            <tr>
                <td>信箱</td>
                <td><input type="text" v-model="employee.email" id="email" required></td>
            </tr>
            <tr>
                <td>電話</td>
                <td><input type="text" v-model="employee.phone" id="phone" required></td>
            </tr>
            <tr>
                <td>住址</td>
                <td><input type="text" v-model="employee.address" id="address" required></td>
            </tr>
            <tr>
                <td>緊急連絡人</td>
                <td><input type="text" v-model="employee.emergencyContact" id="emergencyContact" required></td>
            </tr>
            <tr>
                <td>緊急電話</td>
                <td><input type="text" v-model="employee.energencyPhone" id="energencyPhone" required></td>
            </tr>
            
            </tbody>
            </table>
        </div>
        <div v-else>
            <p>載入中...</p>
        </div>
        <button type="submit" class="btn btn-secondary btn-pill">修改</button>
    </form>
        </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useUserStore from '@/stores/user';
import axiosapi from "@/plugins/axios";
import Swal from "sweetalert2";
const user=useUserStore();
const employeeId=user.empId
const employee = ref({});
// const file=ref("");

const data=ref({})

async function submitForm(){
    data.value={
    employeeId:employee.value.employeeId,
    email:employee.value.email,
    phone:employee.value.phone,
    address:employee.value.address,
    emergencyContact:employee.value.emergencyContact,
    energencyPhone:employee.value.energencyPhone,
    // photoFile:""
    }
    console.log(data.value)
    const response =await axiosapi.post("/employee/detail/update",data.value)
    console.log(response)
    // .then(function(response){
    //     if(response.data.success){
    //         Swal.fire({
    //             title:response.data.message,
    //             icon:"success"
    //         })
    //         router.push("/employee/manage/search");
    //     }else{
    //         Swal.fire({
    //             title:response.data.message,
    //             icon:"warning"
    //         })
    //     }
    // }).catch(function(error){
    //     console.log("error",error);
    //     Swal.fire({
    //         title:"失敗"+error.message,
    //         icon:"error"
    //     });
    // })
}

async function employeeFind(){
try {
    const response = await axiosapi.get(`/employee/detail/${employeeId}`);
    employee.value = response.data; } 
catch (error) {
    console.error('獲取員工資料錯誤:', error);
}
}

function formatDate(date) {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear(); // 取得年份
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0'); // 取得月份並補零
    const day = formattedDate.getDate().toString().padStart(2, '0'); // 取得日期並補零
    return `${year}/${month}/${day}`; // 返回格式化的日期字符串
        };

function handleFileUpload(event) {
    const file = event.target.files[0];  // 獲取選擇的檔案
    if (file) {
        data.value.photoFile = file;  // 更新檔案資訊
    }
    }

onMounted(function(){
    employeeFind()
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