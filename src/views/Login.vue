<template>
  <div class="bg-image" id="body">
    <div class="container d-flex align-items-center justify-content-center" style="min-height: 100vh">
      <div class="d-flex flex-column justify-content-between">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-10">
            <div class="card card-default mb-0">
              <div class="card-header pb-0">
                <div class="app-brand w-100 d-flex justify-content-center border-bottom-0">
                  <a class="w-auto pl-0" href="/index.html">
                    <img
                      src="https://cdn.iconscout.com/icon/free/png-256/free-dashboard-icon-download-in-svg-png-gif-file-formats--speedometer-neon-blue-ui-icons-pack-user-interface-461930.png?f=webp&w=256"
                      alt="Mono" width="25%">
                    <span class="brand-name text-dark" style="margin-left: 20px; font-size:xx-large;">Flux  EIP</span>
                  </a>
                </div>
              </div>
              <div class="card-body px-5 pb-5 pt-0">
                <h4 class="text-dark mb-6 text-center">登入系統</h4>
                <form @submit.prevent="handleSubmit">
                  <div class="row">
                    <div class="form-group col-md-12 mb-4">
                      <input
                        type="text"
                        v-model="username"
                        class="form-control input-lg"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="帳號"
                        required>
                    </div>
                    <div class="form-group col-md-12">
                      <input
                        type="password"
                        v-model="password"
                        class="form-control input-lg"
                        id="password"
                        placeholder="密碼"
                        required>
                    </div>
                    <div class="col-md-12">
                      <div class="d-flex justify-content-between mb-3">
                        <div class="custom-control custom-checkbox mr-3 mb-3">
                          <input
                            type="checkbox"
                            v-model="rememberMe"
                            class="custom-control-input"
                            id="customCheck2">
                          <label class="custom-control-label" for="customCheck2">記住我</label>
                        </div>
                        <a class="text-color" href="#"> 忘記密碼？ </a>
                      </div>
                      <button type="submit" class="btn btn-primary btn-pill mb-4">登入</button>
                      <p v-if="error" class="error">{{ error }}</p>
                      <p>
                        Don't have an account yet ? <a class="text-blue" href="sign-up.html">Sign Up</a>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')

const handleSubmit = async () => {
  try {
    // 發送登入請求至 /perform_login（根據實際需求調整 API 路徑與參數）
    const response = await axios.post('/perform_login', {
      username: username.value,
      password: password.value,
      rememberMe: rememberMe.value
    })
    console.log('Login successful:', response.data)
    // 登入成功後可依需求導向其他頁面，例如：
    // window.location.href = '/dashboard'
  } catch (err) {
    console.error(err)
    error.value = '登入失敗，請檢查帳號或密碼'
  }
}
</script>

<style>
.bg-image {
  background-image: url('https://images.unsplash.com/photo-1616596871445-bb8290a7a2c2?q=80&w=2007&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

.card {
  background: rgba(255, 255, 255, 0.9); /* 白色但透明 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}
</style>
