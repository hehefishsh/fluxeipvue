<template>
    <el-dialog 
      :model-value="isOpen" 
      title="預約會議室" 
      width="500px"
      @close="close"
    >
      <el-form label-width="100px">
        <el-form-item label="會議室">
          <el-input v-model="room.roomName" disabled></el-input>
        </el-form-item>
  
        <el-form-item label="申請人">
          <el-input v-model="employee.empName" disabled></el-input>
        </el-form-item>
  
        <el-form-item label="主題">
          <el-input v-model="meeting.title" placeholder="請輸入會議主題"></el-input>
        </el-form-item>
  
        <el-form-item label="開始時間">
          <el-date-picker v-model="meeting.startTime" type="datetime" placeholder="選擇開始時間"></el-date-picker>
        </el-form-item>
  
        <el-form-item label="結束時間">
          <el-date-picker v-model="meeting.endTime" type="datetime" placeholder="選擇結束時間"></el-date-picker>
        </el-form-item>
  
        <div class="d-flex justify-content-end">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="reserveMeeting">送出預約</el-button>
        </div>
      </el-form>
    </el-dialog>
  </template>
  
  <script setup>
import { ref, defineProps, defineEmits } from "vue";


import { computed } from "vue";

const room = computed(() => props.room || { roomName: "未選擇會議室" });


// ✅ 初始化 `meeting` 避免 `undefined` 錯誤
const meeting = ref({
  title: "",
  startTime: "",
  endTime: ""
});

// ✅ 接收 `isOpen`、`room`、`employee`
const props = defineProps({
  isOpen: Boolean,
  room: Object,
  employee: Object,
});

// ✅ 定義 emit 事件
const emits = defineEmits(["update:isOpen", "reserve"]);

// ✅ 關閉對話框
const close = () => {
  emits("update:isOpen", false);
};

// ✅ 送出預約
const reserveMeeting = () => {
  emits("reserve", { ...meeting.value, room: props.room, employee: props.employee });
  close();
};
</script>

<style scoped>
/* 讓 disabled 的 el-input 文字變成黑色，並讓滑鼠恢復正常 */
:deep(.el-input.is-disabled .el-input__inner) {
  color: black !important;
  -webkit-text-fill-color: black !important;
  opacity: 1 !important;
  cursor: text !important; /* 讓滑鼠變回正常輸入框樣式 */
}

/* 進一步確保 `cursor: not-allowed` 被移除 */
:deep(.el-input.is-disabled) {
  cursor: text !important; /* 讓外層 el-input 也不顯示禁止符號 */
}

/* 覆蓋 Element Plus 禁止狀態的全局樣式 */
:deep(.el-input__wrapper.is-disabled) {
  cursor: text !important;
}

</style>