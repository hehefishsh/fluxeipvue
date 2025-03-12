<template>
       <div class="card h-100 shadow-sm">
          <!-- 圖片 (固定高度 & 自適應寬度) -->
          <img class="card-img-top room-img" 
            alt="會議室圖片"
            :src="item.image ? 'data:image/jpeg;base64,' + item.image : defaultImage"
          >
          <div class="card-body">
            <h5 class="card-title">{{ item.roomName }}</h5>
            <div class="card-text text-danger">容納人數: {{ item.capacity }}</div>
            <div class="card-text">地點: {{ item.location }}</div>
            <div class="row mt-3">
              <div class="col text-start">
                <button class="btn btn-primary" @click="emits('openUpdate','update',item.id)">修改</button>
              </div>
              <div class="col text-end">
                <button class="btn btn-danger"  @click="emits('delete',item.id)">刪除</button> 
              </div>
            </div>
          </div>
        </div>
      
</template>
    
<script setup >

import { ref } from 'vue';

// 預設圖片 (避免圖片不存在時顯示錯誤)
const defaultImage = ref('https://dummyimage.com/300x200/ccc/000&text=No+Image');

const props = defineProps(["item"]);

const emits = defineEmits(["openUpdate","delete"])

</script>
    
<style scoped>

/* 圖片不要超過卡片的範圍 */
.room-img {
  width: 100%; /* 滿版 */
  height: 200px; /* 高度 */
  object-fit: cover; /* 保持比例 */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

/* 對齊 */
.card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
}

/* 放大 */
.card:hover {
  transform: scale(1.02); 
}
</style>