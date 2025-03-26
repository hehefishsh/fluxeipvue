<template>
  <div>
    <!-- 查詢補卡申請資料 -->
    <div class="card card-default" id="overtime-request-query">
      <div class="card-header"></div>
      <div class="card-body py-0" data-simplebar>
        <!-- 顯示錯誤信息 -->
        <div v-show="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <div class="d-flex justify-content-between">
          <ul class="nav nav-pills mb-3 justify-content-between" id="pills-tab12" role="tablist">
            <li class="nav-item" v-for="status in statuses" :key="status.key">
              <a class="nav-link" :class="{ active: activeTab === status.key }" @click="activeTab = status.key"
                href="#">
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

        <!-- 篩選顯示對應的補卡申請資料 -->
        <div class="tab-content mt-3">
          <div v-if="filteredMissingPunchRequests.length">
            <table class="table table-borderless table-thead-border">
              <thead>
                <tr>
                  <th>申請Id</th>
                  <th>申請人</th>
                  <th>補卡類型</th>
                  <th>缺卡日期</th>
                  <th>原因</th>
                  <th>狀態</th>
                  <th>其他</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(request, index) in filteredMissingPunchRequests" :key="index">
                  <td>{{ request.missingPunchRequestId }}</td>
                  <td>{{ request.employeeName }}</td>
                  <td>{{ request.clockType }}</td>
                  <td>{{ formatDate(request.missingDate) }}</td>
                  <td>{{ request.reason }}</td>
                  <td>{{ request.status }}</td>
                  <td>
                    <button class="badge badge-info" @click="showModal(request)" data-toggle="modal"
                      data-target="#missingPunchRequestModal">
                      查看詳情
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p class="text-center text-muted">無相關補卡申請資料</p>
          </div>
        </div>
        <div class="bg-white py-4"></div>
      </div>
    </div>
    <MissingPunchDetails :missingPunchRequest="selectedMissingPunchRequest" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user";
import MissingPunchDetails from "./MissingPunchDetails.vue";

const user = useUserStore();
const missingPunchRequestData = ref([]);
const error = ref("");
const activeTab = ref("all");
const selectedMissingPunchRequest = ref(null);

const statuses = [
  { key: "all", label: "全部" },
  { key: "pending", label: "待審核" },
  { key: "reviewing", label: "審核中" },
  { key: "approved", label: "已核決" },
  { key: "rejected", label: "未核准" }
];

const showModal = (request) => {
  selectedMissingPunchRequest.value = request;
};

onMounted(async () => {
  try {
    const response = await axiosapi.get(`/api/missing-punch/employee/${user.empId}`);
    missingPunchRequestData.value = response.data;
  } catch (err) {
    error.value = "無法取得補卡申請資料";
  }
});

const filteredMissingPunchRequests = computed(() => {
  if (activeTab.value === "all") return missingPunchRequestData.value;
  return missingPunchRequestData.value.filter((request) => request.status === statuses.find(s => s.key === activeTab.value)?.label);
});

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date(dateStr));
};
</script>

<style scoped>
.table {
  table-layout: fixed;
  width: 100%;
}

.table td,
.table th {
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
</style>