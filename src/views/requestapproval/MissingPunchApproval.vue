<template>
  <div>
    <!-- 查詢補卡簽核資料 -->
    <div class="card card-default" id="work-adjust-query">
      <div class="card-header"></div>
      <div class="card-body py-0" data-simplebar>
        <!-- 顯示錯誤信息 -->
        <div v-show="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <!-- 分類標籤 -->
        <div class="d-flex justify-content-between">
          <ul class="nav nav-pills mb-3 justify-content-between" id="workadjust-tabs" role="tablist">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">全部</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'pending' }" @click="activeTab = 'pending'">待審核</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'reviewing' }"
                @click="activeTab = 'reviewing'">審核中</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'approved' }" @click="activeTab = 'approved'">已核決</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'rejected' }" @click="activeTab = 'rejected'">未核准</a>
            </li>
          </ul>
          <div>
            <RouterLink class="btn btn-outline-primary btn-pill ms-auto" to="/">返回首頁</RouterLink>
          </div>
        </div>

        <!-- 篩選顯示對應的補卡資料 -->
        <div class="tab-content mt-3">
          <div v-if="filteredMissingPunchRequests.length">
            <table class="table table-borderless table-thead-border">
              <thead>
                <tr>
                  <th class="text">申請Id</th>
                  <th class="text">申請人</th>
                  <th class="text">補卡類型</th>
                  <th class="text">缺卡日期</th>
                  <th class="text">原因</th>
                  <th class="text">提交時間</th>
                  <th class="text">狀態</th>
                  <th class="text">核准</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(missingPunch, index) in filteredMissingPunchRequests" :key="index">
                  <td class="text">{{ missingPunch.requestId }}</td>
                  <td class="text">{{ missingPunch.requestEmployeeName }}</td>
                  <td class="text">{{ missingPunch.type }}</td>
                  <td class="text">
                    {{ formatDate(missingPunch.missingDate) }}
                  </td>
                  <td class="text">{{ missingPunch.reason }}</td>
                  <td class="text">
                    {{ formatDateTime(missingPunch.submittedAt) }}
                  </td>
                  <td class="text">{{ missingPunch.status }}</td>
                  <td class="text">
                    <button class="badge badge-square badge-success" @click="showModal(missingPunch, 'approve')"
                      data-toggle="modal" data-target="#missingPunchModal">
                      核可
                    </button>
                    <button class="badge badge-square badge-warning" @click="showModal(missingPunch, 'reject')"
                      data-toggle="modal" data-target="#missingPunchModal">
                      否決
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p class="text-center text-muted">無相關補卡資料</p>
          </div>
        </div>

        <div class="bg-white py-4"></div>
      </div>
    </div>

    <!-- 呼叫加減班詳情元件並傳遞 selectedWorkAdjustRequest -->
    <MissingPunchApprovalDetails :missingPunchRequest="selectedMissingPunchRequest" :actionType="actionType"
      @updatemissingPunchRequest="reloadData" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user";
import MissingPunchApprovalDetails from "./MissingPunchApprovalDetails.vue";

const user = useUserStore();
const missingPunchRequestData = ref([]);
const error = ref("");
const activeTab = ref("pending"); // 預設顯示 "待審核"
const selectedMissingPunchRequest = ref(null);
const actionType = ref("");

// 顯示加減班詳情 Modal
const showModal = (missingPunch, type) => {
  selectedMissingPunchRequest.value = adjustment;
  actionType.value = type; // 設定是「核准」還是「否決」
};

// 重新載入數據
const reloadData = async () => {
  selectedMissingPunchRequest.value = null; // 清除選取
  actionType.value = ""; // 清空 actionType
  try {
    const response = await axiosapi.get(
      `/api/approval/missingpunch/pending/${user.empId}`
    );
    missingPunchRequestData.value = response.data; // 更新列表
  } catch (err) {
    error.value = "無法取得補卡資料";
  }
};

// 查詢補卡資料
onMounted(async () => {
  try {
    const response = await axiosapi.get(
      `/api/approval/missingpunch/pending/${user.empId}`
    );
    missingPunchRequestData.value = response.data;
  } catch (err) {
    error.value = "無法取得補卡資料";
  }
});

// 根據標籤篩選加減班資料
const filteredMissingPunchRequests = computed(() => {
  if (!Array.isArray(missingPunchRequestData.value)) return [];
  if (activeTab.value === "all") return missingPunchRequestData.value;
  return missingPunchRequestData.value.filter((missingPunch) => {
    switch (activeTab.value) {
      case "pending":
        return missingPunch.status === "待審核";
      case "reviewing":
        return missingPunch.status === "審核中";
      case "approved":
        return missingPunch.status === "已核決";
      case "rejected":
        return missingPunch.status === "未核准";
      default:
        return true;
    }
  });
});

// 日期格式化
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("zh-TW");
};

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  return new Date(dateTimeStr).toLocaleString("zh-TW");
};
</script>

<style scoped>
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
