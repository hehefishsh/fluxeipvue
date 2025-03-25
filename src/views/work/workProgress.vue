<template>
  <div class="accordion accordion-shadow" id="accordionShadow">
    <div class="card" v-for="work in works" :key="work.workprogressId">
      <div class="card-header" :id="'headingShadow' + work.workprogressId">
        <h2 class="mb-0">
          <button
            class="btn btn-link collapsed"
            type="button"
            data-toggle="collapse"
            :data-target="'#collapseShadow' + work.workprogressId"
            aria-expanded="false"
            :aria-controls="'collapseShadow' + work.workprogressId"
          >
            {{ work.workName }}
          </button>
        </h2>
      </div>
      <div
        :id="'collapseShadow' + work.workprogressId"
        class="collapse"
        :aria-labelledby="'headingShadow' + work.workprogressId"
        data-parent="#accordionShadow"
      >
        <div class="card-body">
          <p class="card-text pb-4 pt-1">
            創建日期 : {{ formatDate(work.createDate) }}
          </p>
          <p class="card-text pb-4 pt-1">
            預計完成日期 : {{ formatDate(work.expectedFinishDate) }}
          </p>
          <p class="card-text pb-4 pt-1" v-if="work.finishDate == null">
            完成日期 : 尚未完成
          </p>
          <p class="card-text pb-4 pt-1" v-if="work.finishDate != null">
            完成日期 : {{ formatDate(work.finishDate) }}
          </p>
          <p class="card-text pb-4 pt-1">
            負責人 : {{ work.supervisor.employeeName }}
          </p>
          <RouterLink
            :to="`/work/progress/detail/${work.workprogressId}`"
            class="btn btn-primary btn-sm"
            >查看</RouterLink
          >
        </div>
      </div>
    </div>
  </div>

  <button class="fixed-button" @click="createWork">新增工作</button>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosapi from "@/plugins/axios-login";
import useUserStore from "@/stores/user";

const works = ref({});

async function allwork() {
  const response = await axiosapi.get("/workProgress/all");
  works.value = response.data;
}

onMounted(function () {
  allwork();
});

function formatDate(date) {
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear(); // 取得年份
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0"); // 取得月份並補零
  const day = formattedDate.getDate().toString().padStart(2, "0"); // 取得日期並補零
  return `${year}/${month}/${day}`; // 返回格式化的日期字符串
}
</script>

<style setup>
.fixed-button {
  position: fixed;
  bottom: 20px; /* 按鈕離底部 20px */
  right: 20px; /* 按鈕離右邊 20px */
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10%;
  /* font-size: 16px; */
  cursor: pointer;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); */
  transition: background-color 0.3s ease;
}
</style>
