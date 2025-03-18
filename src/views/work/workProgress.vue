<template>
        <div class="row">
            <div class="col-md-6 col-xl-10" v-for="work in works" :key="work.workprogressId">
                <div class="card py-3 mb-4">
                    <div class="card-body">
                        <h5 class="card-title ">{{work.workName}}</h5>
                        創建日期<p class="card-text pb-4 pt-1">{{formatDate(work.createDate)}}</p>
                        預計完成日期<p class="card-text pb-4 pt-1">{{formatDate(work.expectedFinishDate)}}</p>
                        完成日期<p class="card-text pb-4 pt-1">{{formatDate(work.finishDate)}}</p>
                        負責人<p class="card-text pb-4 pt-1">{{work.supervisor.employeeName}}</p>
                        <a href="#" class="btn btn-link text-primary px-0">查看</a>
                    </div>
                </div>
            </div>
        </div>
</template>
    
<script setup>
import { ref, onMounted } from 'vue'
import axiosapi from "@/plugins/axios-login";
import useUserStore from '@/stores/user';

const works=ref({});

async function allwork(){
    const response=await axiosapi.get("/workProgress/all");
    works.value=response.data
    console.log(works.value)
}

onMounted(function(){
  allwork();
})

function formatDate(date) {
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear(); // 取得年份
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0'); // 取得月份並補零
  const day = formattedDate.getDate().toString().padStart(2, '0'); // 取得日期並補零
  return `${year}/${month}/${day}`; // 返回格式化的日期字符串
    };
</script>
    
<style>
    
</style>