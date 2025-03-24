<template>
    <div class="card card-default form-container">
        <form @submit.prevent="submitForm">

            <h3 class="form-title">工作內容</h3>
            工作名稱<input v-model="work.name" placeholder="輸入名稱" class="input-field" />
            創立日期<input type="date" v-model="work.createDate" class="custom-select my-1 mr-sm-2 w-auto" required />
            預計完成日期<input type="date" v-model="work.expectedFinishDate" class="custom-select my-1 mr-sm-2 w-auto" required />

            <h3 class="form-title">分配工作</h3>
            <div v-for="(content, index) in contents" :key="index" class="content-group">
                <div class="content-wrapper">
                <!-- 文字 or 連結輸入框 -->
                交辦事項名稱<input v-if="content.contentType === 'text'" 
             v-model="content.textContent" 
             :placeholder="'輸入交辦事項名稱 '" class="input-field"/>
             交辦事項內容<input v-if="content.contentType === 'text'" 
             v-model="content.text2Content" 
             :placeholder="'輸入交辦事項內容 '" class="input-field"/>

      <!-- 日期欄位 -->
      <input v-if="content.contentType === 'date'" 
             type="date" 
             v-model="content.dateContent" />

      <!-- 選擇器欄位 -->
      <select v-if="content.contentType === 'select'" 
              v-model="content.selectedValue">
        <option v-for="(option, idx) in content.options" :key="idx" :value="option">
          {{ option }}</option></select>
                </div>

                <!-- 刪除按鈕 -->
                <button type="button" @click="removeField(index)" class="delete-button">X</button>
        </div>
        <!-- 新增內容按鈕 -->
        <button type="button" @click="addField" class="add-button">新增交辦事項</button>
  
        <!-- 送出按鈕 -->
        <button type="submit" class="submit-button">提交</button>
      </form>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router"; // 引入 useRoute
import axios from "axios";
import { useRouter } from 'vue-router';

const work=ref({})

const router = useRouter();
// 使用 useRoute 獲取當前路由
const route = useRoute();

// **狀態管理**
const contents = ref([{ contentType: "text", textContent: "" },{ contentType: "date", dateContent: "" },{
        contentType: "select",
        options: ["選項1", "選項2", "選項3"],
        selectedValue: ""
      }]);


// **新增欄位**
function addField() {
  contents.value.push({ contentType: "text", textContent: "" });
  contents.value.push({ contentType: "date", dateContent: "" });
      contents.value.push({
        contentType: "select",
        options: ["選項1", "選項2", "選項3"],
        selectedValue: ""
      });
}

// **刪除欄位**
function removeField(index) {
  contents.value.splice(index, 1);
  imageFiles.value.splice(index, 1);
  imagePreviews.value.splice(index, 1);
}

// **表單提交**
async function submitForm() {
  const formData = new FormData();
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
