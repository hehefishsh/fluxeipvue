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
            <form @submit.prevent="clockIn(1)">
              <button type="submit" class="mb-1 btn btn-pill btn-primary">上班打卡</button>
            </form>
            <form @submit.prevent="clockOut(2)">
              <button type="submit" class="mb-1 btn btn-pill btn-primary">下班打卡</button>
            </form>
          </div>
  
          <!-- 外出/外出結束 打卡按鈕 -->
          <div class="button-group">
            <form @submit.prevent="clockIn(5)">
              <button type="submit" class="mb-1 btn btn-outline-primary btn-pill">外出打卡</button>
            </form>
            <form @submit.prevent="clockOut(6)">
              <button type="submit" class="mb-1 btn btn-outline-primary btn-pill">外出結束</button>
            </form>
          </div>
  
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
          <div v-if="message" class="alert alert-success">{{ message }}</div>
  
          <br>
          <div>
            <router-link to="/attendancelogs">
              <button type="button" class="mb-1 btn btn-pill btn-success">出勤記錄查詢</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        errorMessage: '',
        message: ''
      };
    },
    methods: {
      async clockIn(clockTypeId) {
        try {
          // 在這裡發送 POST 請求到 /clock
          const response = await fetch('/clock', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clockTypeId })
          });
          const data = await response.json();
          this.message = data.message || '';
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = '打卡失敗，請重試。';
        }
      },
      async clockOut(clockTypeId) {
        try {
          // 在這裡發送 POST 請求到 /clock
          const response = await fetch('/clock', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clockTypeId })
          });
          const data = await response.json();
          this.message = data.message || '';
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = '打卡失敗，請重試。';
        }
      },
      resizeCanvas() {
        const canvas = document.getElementById('clock-canvas');
        const ctx = canvas.getContext('2d');
        const parentWidth = canvas.parentElement.clientWidth;
        const parentHeight = canvas.parentElement.clientHeight;
  
        canvas.width = parentWidth * 0.9; // 留些間距
        canvas.height = parentHeight * 0.6;
  
        ctx.font = `${canvas.width / 5}px Roboto`;
      },
      updateCanvasClock() {
        const canvas = document.getElementById('clock-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
  
        const currentDate = new Date();
        const timeString = currentDate.toLocaleTimeString([], { hour12: false });
  
        ctx.fillText(timeString, canvas.width / 2, canvas.height / 2);
      }
    },
    mounted() {
      this.resizeCanvas();
      this.updateCanvasClock();
      setInterval(this.updateCanvasClock, 1000); // 每秒更新一次
      window.addEventListener('resize', () => {
        this.resizeCanvas();
        this.updateCanvasClock();
      });
    }
  };
  </script>
  
  <style scoped>
  body {
    font-family: 'Roboto', sans-serif;
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
  