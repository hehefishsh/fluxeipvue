<template>
<div class="card h-100 shadow-sm">
  <img class="card-img-top room-img" 
    alt="會議室圖片"
    :src="item.image ? `data:image/jpeg;base64,${item.image}` : defaultImage"
  >
  <div class="card-body">
    <h5 class="card-title">{{ item.roomName }}</h5>
    <div class="card-text text-danger">容納人數: {{ item.capacity }}</div>
    <div class="card-text">地點: {{ item.location }}</div>

    <!-- 調整按鈕對齊方式 -->
    <div class="d-flex justify-content-between mt-3">
      <button class="btn btn-danger px-4 ms-auto" @click="emits('delete', item.id)">刪除</button> 
      <button class="btn btn-primary px-4" @click="emits('openUpdate', item)">修改</button>
    
    </div>
  </div>
</div>

</template>

<script setup>
import { ref } from 'vue';

const defaultImage = ref('https://dummyimage.com/300x200/ccc/000&text=No+Image');

const props = defineProps(["item"]);
const emits = defineEmits(["openUpdate", "delete"]);
</script>

<style scoped>
.room-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: scale(1.02); 
}
</style>
