<template>
  <div id="app" class="navbar-fixed sidebar-fixed">
    <div class="content-wrapper">
      <div class="card">
        <!-- 時鐘顯示 -->
        <div class="clock">
          <canvas id="clock-canvas"></canvas>
        </div>

        <!-- 上班/下班 打卡按鈕 -->
        <div class="button-group">
          <button @click="clockIn" class="mb-1 btn btn-pill btn-primary">
            上班打卡
          </button>
          <button @click="clockOut" class="mb-1 btn btn-pill btn-primary">
            下班打卡
          </button>
        </div>

        <!-- 外出/外出結束 打卡按鈕 -->
        <div class="button-group">
          <button
            @click="startFieldWork"
            class="mb-1 btn btn-outline-primary btn-pill"
          >
            外出打卡
          </button>
          <button
            @click="endFieldWork"
            class="mb-1 btn btn-outline-primary btn-pill"
          >
            外出結束
          </button>
        </div>

        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
        <div v-if="message" class="alert alert-success">{{ message }}</div>

        <br />
        <div>
          <router-link to="/attendance/log">
            <button type="button" class="mb-1 btn btn-pill btn-success">
              出勤記錄查詢
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user.js";

const user = useUserStore();
const errorMessage = ref("");
const message = ref("");

// 打卡 API 請求
const sendClockRequest = async (url) => {
  try {
    const response = await axiosapi.post(url, null);
    message.value = response.data;
    errorMessage.value = "";
    return response.data;
  } catch (error) {
    errorMessage.value = "打卡失敗，請重試。";
    message.value = "";
    throw error;
  }
};


// 打卡按鈕方法整理
const clockIn = () => sendClockRequest("/api/clock/in");
const clockOut = () => sendClockRequest("/api/clock/out");
const startFieldWork = () => sendClockRequest("/api/clock/field-work-start");
const endFieldWork = () => sendClockRequest("/api/clock/field-work-end");

// 時鐘
const resizeCanvas = () => {
  const canvas = document.getElementById("clock-canvas");
  const ctx = canvas.getContext("2d");
  const parentWidth = canvas.parentElement.clientWidth;
  const parentHeight = canvas.parentElement.clientHeight;

  canvas.width = parentWidth * 0.9;
  canvas.height = parentHeight * 0.6;

  ctx.font = `${canvas.width / 5}px Roboto`;
};

const updateCanvasClock = () => {
  const canvas = document.getElementById("clock-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#333";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const currentDate = new Date();
  const timeString = currentDate.toLocaleTimeString([], { hour12: false });

  ctx.fillText(timeString, canvas.width / 2, canvas.height / 2);
};

// 定時器初始和清除
let intervalId;

onMounted(() => {
  resizeCanvas();
  updateCanvasClock();
  intervalId = setInterval(updateCanvasClock, 1000);
  window.addEventListener("resize", () => {
    resizeCanvas();
    updateCanvasClock();
  });
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
  window.removeEventListener("resize", resizeCanvas);
});
</script>

<style scoped>
body {
  font-family: "Roboto", sans-serif;
  background-color: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.card {
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  width: 400px;
}
.clock {
  font-size: 4rem;
  font-weight: bold;
  color: #333;
}
.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
.button-group button {
  padding: 12px 24px;
  cursor: pointer;
  font-size: 16px;
  margin: 0 10px;
}
.status {
  margin-top: 10px;
  font-size: 18px;
}
.success {
  color: green;
}
.success::before {
  content: "✓ ";
}
.error {
  color: red;
}
.error::before {
  content: "✗ ";
}
.subtle {
  color: #7f8c8d;
}
</style>
