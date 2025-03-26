<template>
  <div>
    <!-- 查詢加減班申請資料 -->
    <div class="card card-default" id="overtime-request-query">
      <div class="card-header"></div>
      <div class="card-body py-0" data-simplebar>
        <!-- 顯示錯誤信息 -->
        <div v-show="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <div class="d-flex justify-content-between">
          <ul
            class="nav nav-pills mb-3 justify-content-between"
            id="pills-tab12"
            role="tablist"
          >
            <li class="nav-item" v-for="status in statuses" :key="status.key">
              <a
                class="nav-link"
                :class="{ active: activeTab === status.key }"
                @click="activeTab = status.key"
                href="#"
              >
                {{ status.label }}
              </a>
            </li>
          </ul>
          <div>
            <RouterLink class="btn btn-outline-primary btn-pill ms-auto" to="/">
              返回首頁
            </RouterLink>
          </div>
        </div>

        <!-- 篩選顯示對應的加減班申請資料 -->
        <div class="tab-content mt-3">
          <div v-if="filteredOvertimeRequests.length">
            <table class="table table-borderless table-thead-border">
              <thead>
                <tr>
                  <th>申請Id</th>
                  <th>申請人</th>
                  <th>加減班類型</th>
                  <th>加班日期</th>
                  <th>時數</th>
                  <th>原因</th>
                  <th>申請時間</th>
                  <th>狀態</th>
                  <th>其他</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(request, index) in filteredOvertimeRequests"
                  :key="index"
                >
                  <td>{{ request.workAdjustmentRequestId }}</td>
                  <td>{{ request.employeeName }}</td>
                  <td>{{ request.adjustmentType }}</td>
                  <td class="highlinestar">
                    {{ formatDate(request.adjustmentDate) }}
                  </td>
                  <td>{{ request.hours }}</td>
                  <td>{{ request.reason }}</td>
                  <td>{{ formatDateSecond(request.submittedAt) }}</td>
                  <td>{{ request.status }}</td>
                  <td>
                    <button
                      class="badge badge-info"
                      @click="showModal(request)"
                      data-toggle="modal"
                      data-target="#overtimeRequestModal"
                    >
                      查看詳情
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p class="text-center text-muted">無相關加減班申請資料</p>
          </div>
        </div>
        <div class="bg-white py-4"></div>
      </div>
    </div>
    <WorkAdjustmentDetails :overtimeRequest="selectedOvertimeRequest" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user";
import WorkAdjustmentDetails from "./WorkAdjustmentDetails.vue";

const user = useUserStore();
const overtimeRequestData = ref([]);
const error = ref("");
const activeTab = ref("all");
const selectedOvertimeRequest = ref(null);

const statuses = [
  { key: "all", label: "全部" },
  { key: "pending", label: "待審核" },
  { key: "reviewing", label: "審核中" },
  { key: "approved", label: "已核決" },
  { key: "rejected", label: "未核准" },
];

const showModal = (request) => {
  selectedOvertimeRequest.value = request;
};

onMounted(async () => {
  try {
    const response = await axiosapi.get(
      `/api/work-adjustments/employee/${user.empId}`
    );
    overtimeRequestData.value = response.data;
  } catch (err) {
    error.value = "無法獲取加減班申請資料";
  }
});

const filteredOvertimeRequests = computed(() => {
  if (activeTab.value === "all") return overtimeRequestData.value;
  return overtimeRequestData.value.filter(
    (request) =>
      request.status === statuses.find((s) => s.key === activeTab.value)?.label
  );
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

  return `${year}年${month}月${day}日 (${weekDay})`;
};

// 簡單日期格式化函式，依需求調整格式
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
