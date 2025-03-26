<template>
  <div>
    <!-- 查詢請假資料 -->
    <div class="card card-default" id="leave-request-query">
      <div class="card-header">
        <!-- <h2>請假資料查詢</h2> -->
        <!-- <RouterLink class="btn btn-outline-primary btn-pill" to="/">返回首頁</RouterLink> -->
      </div>
      <div class="card-body py-0" data-simplebar>
        <!-- 顯示錯誤信息 -->
        <div v-show="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <!-- 分類標籤 -->
        <div class="d-flex justify-content-between">
          <ul
            class="nav nav-pills mb-3 justify-content-between"
            id="leave-tabs"
            role="tablist"
          >
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'all' }"
                @click="activeTab = 'all'"
                >全部</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'pending' }"
                @click="activeTab = 'pending'"
                href="#"
                >待審核</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'reviewing' }"
                @click="activeTab = 'reviewing'"
                href="#"
                >審核中</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'approved' }"
                @click="activeTab = 'approved'"
                href="#"
                >已核決</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'rejected' }"
                @click="activeTab = 'rejected'"
                href="#"
                >未核准</a
              >
            </li>
          </ul>
          <div>
            <RouterLink class="btn btn-outline-primary btn-pill ms-auto" to="/"
              >返回首頁</RouterLink
            >
          </div>
        </div>

        <!-- 篩選顯示對應的請假資料 -->
        <div class="tab-content mt-3">
          <div v-if="filteredLeaveRequests.length">
            <table class="table table-borderless table-thead-border">
              <thead>
                <tr>
                  <th class="text">申請Id</th>
                  <th class="text">申請人</th>
                  <th class="text">請假類型</th>
                  <th class="text">開始時間</th>
                  <th class="text">結束時間</th>
                  <th class="text">請假時數</th>
                  <th class="text">請假原因</th>
                  <th class="text">申請時間</th>
                  <th class="text">附件</th>
                  <th class="text">狀態</th>
                  <th class="text">核准</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(leave, index) in filteredLeaveRequests"
                  :key="index"
                >
                  <td class="text">{{ leave.leaveRequestId }}</td>
                  <td class="text">{{ leave.requestEmployeeName }}</td>
                  <td class="text">{{ leave.leaveType }}</td>
                  <td class="text highlinestar">
                    {{ formatDate(leave.startDatetime) }}
                  </td>
                  <td class="text highlinestar">
                    {{ formatDate(leave.endDatetime) }}
                  </td>
                  <td class="text">{{ leave.leaveHours }}</td>
                  <td class="text">{{ leave.reason }}</td>
                  <td class="text">
                    {{ formatDateSecond(leave.submittedAt) }}
                  </td>
                  <td class="text">
                    <button
                      v-if="leave.attachmentName"
                      @click="
                        downloadfile(leave.attachmentName, leave.attachmentPath)
                      "
                      class="badge badge-primary"
                    >
                      下載附件
                    </button>
                    <span v-else>無</span>
                    {{ leave.attachmentName }}
                  </td>
                  <td class="text">{{ leave.status }}</td>
                  <td class="text">
                    <button
                      class="badge badge-square badge-success"
                      @click="showModal(leave, 'approve')"
                      data-toggle="modal"
                      data-target="#leaveRequestModal"
                    >
                      核可
                    </button>
                    <button
                      class="badge badge-square badge-warning"
                      @click="showModal(leave, 'reject')"
                      data-toggle="modal"
                      data-target="#leaveRequestModal"
                    >
                      否決
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p class="text-center text-muted">無相關請假資料</p>
          </div>
        </div>

        <div class="bg-white py-4"></div>
      </div>
    </div>

    <!-- 呼叫請假詳情元件並傳遞selectedLeaveRequest -->
    <LeaveRequestApprovalDetails
      :leaveRequest="selectedLeaveRequest"
      :actionType="actionType"
      @update:leaveRequest="reloadData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user";
import LeaveRequestApprovalDetails from "./LeaveRequestApprovalDetails.vue";

const user = useUserStore();
const leaveRequestData = ref([]);
const error = ref("");
const activeTab = ref("pending"); // 預設顯示 "待審核"
const selectedLeaveRequest = ref(null);
const actionType = ref("");

// 顯示請假詳情Modal
const showModal = (leave, type) => {
  selectedLeaveRequest.value = leave;
  actionType.value = type; // 設定是「核准」還是「否決」
};
const reloadData = async () => {
  selectedLeaveRequest.value = null; // 確保 modal 關閉時清空選取
  actionType.value = ""; // 清空 actionType
  try {
    const response = await axiosapi.get(
      `/api/approval/leave/pending/${user.empId}`
    );
    leaveRequestData.value = response.data; // 更新列表
  } catch (err) {
    error.value = "無法獲取請假資料";
  }
};
// 查詢請假資料
onMounted(async () => {
  try {
    const response = await axiosapi.get(
      `/api/approval/leave/pending/${user.empId}`
    ); // 查詢待審核的請假單
    leaveRequestData.value = response.data;
  } catch (err) {
    error.value = "無法獲取請假資料";
  }
});

// 根據標籤篩選請假資料
const filteredLeaveRequests = computed(() => {
  if (!Array.isArray(leaveRequestData.value)) return [];
  if (activeTab.value === "all") return leaveRequestData.value;
  return leaveRequestData.value.filter((leave) => {
    switch (activeTab.value) {
      case "pending":
        return leave.status === "待審核";
      case "reviewing":
        return leave.status === "審核中";
      case "approved":
        return leave.status === "已核決";
      case "rejected":
        return leave.status === "未核准";
      default:
        return true;
    }
  });
});

// 簡單日期格式化函式，依需求調整格式
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份從0開始
  const day = String(date.getDate()).padStart(2, "0");

  // 取得星期幾的中文名稱
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekDay = weekdays[date.getDay()];

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}年${month}月${day}日 (${weekDay}) ${hours}:${minutes}`;
};

const formatDateSecond = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份從0開始
  const day = String(date.getDate()).padStart(2, "0");

  // 取得星期幾的中文名稱
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekDay = weekdays[date.getDay()];

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

function downloadfile(attachmentName, attachmentPath) {
  axiosapi
    .get(`/api/leave-requests/attachments/${attachmentPath}`, {
      responseType: "blob", // 確保返回的是二進制數據
    })
    .then((response) => {
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = decodeURIComponent(attachmentName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("下載失敗", error);
    });
}
</script>

<style scoped>
/* .table {
  table-layout: fixed;
  width: 100%;
} */

.table td,
.table th {
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.text {
  white-space: nowrap;
}
</style>
