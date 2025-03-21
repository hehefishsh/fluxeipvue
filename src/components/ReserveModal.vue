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
  
        <el-form-item label="選擇日期">
  <el-date-picker
    v-model="meeting.date"
    type="date"
    placeholder="選擇日期"
    :disabled-date="disabledDate"
    value-format="YYYY-MM-DD"
    
  ></el-date-picker>
</el-form-item>

<el-form-item label="開始時間">
  <el-time-select
    v-model="meeting.startTime"
    placeholder="選擇開始時間"
    start="08:00"
    step="00:30"
    end="18:00"
  ></el-time-select>
</el-form-item>

<el-form-item label="結束時間">
  <el-time-select
    v-model="meeting.endTime"
    placeholder="選擇結束時間"
    start="08:00"
    step="00:30"
    end="18:00"
  ></el-time-select>
</el-form-item>
  
        <div class="d-flex justify-content-end">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="reserveMeeting">送出預約</el-button>
        </div>
      </el-form>
    </el-dialog>
  </template>
  
  <script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import Swal from "sweetalert2";
import dayjs from "dayjs";  //dayjs 處理時間格式

//定義 emit 事件
const emits = defineEmits(["update:isOpen", "reserve"]);







const props = defineProps({
  isOpen: Boolean,
  room: Object,
  employee: Object, // 這裡應該是 userStore
});

const meeting = ref({
  title: "",
  date: "",
  startTime: null,
  endTime: null,
  employeeId: null,  // 先給 `null`，等 `watch()` 設定
  employeeName: "",
});

// **使用 `watch()` 確保 `props.employee` 初始化時有值**
watch(() => props.employee, (newVal) => {
  if (newVal) {
    meeting.value.employeeId = newVal.empId?.value || null;
    meeting.value.employeeName = newVal.empName?.value || "";
  }
}, { immediate: true });  // `immediate: true` 讓它立即執行


// 限制不可選日期（不能選擇週六、週日）
const disabledDate = (time) => {
  // 取得當天是星期幾（0: 週日, 1: 週一, ..., 6: 週六）
  const dayOfWeek = dayjs(time).day();

  // 禁止選擇週六（6）與週日（0）
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return true; // 禁用該日期
  }
  return false; // 允許選擇該日期
};



//關閉對話框
const close = () => {
  emits("update:isOpen", false);
};

//送出預約
const reserveMeeting = () => {

  console.log("props.employee 檢查:", props.employee); // 確保 `employee` 存在
  console.log("props.employee.empId:", props.employee?.empId); // 確保 `empId` 存在
  console.log("props.employee.empId.value:", props.employee?.empId?.value); // 確保 `.value` 可以存取


  if (!meeting.value.title.trim()) {
    Swal.fire("錯誤", "請輸入會議主題", "error");
    close();
    return;
  }
  if (!meeting.value.startTime || !meeting.value.endTime) {
    Swal.fire("錯誤", "請選擇開始和結束時間", "error");
    close();
    return;
  }
  if (meeting.value.startTime >= meeting.value.endTime) {
    Swal.fire("錯誤", "結束時間必須大於開始時間", "error");
    close();
    return;
  }

  // **確保 `props.employee` 是 `userStore`，且 `empId` 正確**


  const reservationData = {
  title: meeting.value.title,
  date: meeting.value.date,
  startTime: meeting.value.startTime,
  endTime: meeting.value.endTime,
  roomId: props.room.id,
  roomName: props.room.roomName,
  employeeId: props.employee.empId,  // ✅ **移除 `.value`**
  employeeName: props.employee.empName,  // ✅ **移除 `.value`**
};


  console.log("發送預約資料:", reservationData);

  // 觸發預約事件
  emits("reserve", reservationData);

  // **關閉彈窗**
  close();
};
</script>

<style scoped>
/* 讓 disabled 的 el-input 文字變成黑色*/
:deep(.el-input.is-disabled .el-input__inner) {
  color: black !important;
  -webkit-text-fill-color: black !important;
  opacity: 1 !important;
  cursor: text !important; /* 讓滑鼠變回正常*/
}

/* 進一步確保 cursor: not-allowed被移除 */
:deep(.el-input.is-disabled) {
  cursor: text !important; /* 讓外層 el-input 也不顯示禁止符號 */
}

/* 覆蓋 Element Plus 禁止狀態的全局樣式 */
:deep(.el-input__wrapper.is-disabled) {
  cursor: text !important;
}

</style>