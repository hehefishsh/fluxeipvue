<template>
  <div
    v-if="workAdjustRequest"
    class="modal fade"
    id="workAdjustModal"
    tabindex="-1"
    aria-labelledby="workAdjustModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="workAdjustModalLabel">加減班詳情</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <table class="table table-borderless">
            <tbody>
              <tr>
                <td>申請Id</td>
                <td>{{ workAdjustRequest.requestId }}</td>
              </tr>
              <tr>
                <td>申請人</td>
                <td>{{ workAdjustRequest.requestEmployeeName }}</td>
              </tr>
              <tr>
                <td>加減班類型</td>
                <td>{{ workAdjustRequest.type }}</td>
              </tr>
              <tr>
                <td>調整日期</td>
                <td>{{ formatDate(workAdjustRequest.adjustmentDate) }}</td>
              </tr>
              <tr>
                <td>時數</td>
                <td>{{ workAdjustRequest.hours }}</td>
              </tr>
              <tr>
                <td>原因</td>
                <td>{{ workAdjustRequest.reason }}</td>
              </tr>
              <tr>
                <td>提交時間</td>
                <td>{{ formatDateTime(workAdjustRequest.submittedAt) }}</td>
              </tr>
            </tbody>
          </table>
          <!-- 新增評論輸入框 -->
          <div class="mb-3">
            <label for="comment" class="form-label">評論</label>
            <textarea
              v-model="comment"
              class="form-control"
              id="comment"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button
            v-if="actionType === 'approve'"
            class="btn btn-success"
            @click="approveWorkAdjust"
          >
            核准
          </button>
          <button
            v-if="actionType === 'reject'"
            class="btn btn-warning"
            @click="rejectWorkAdjust"
          >
            否決
          </button>
          <button
            class="btn btn-danger"
            @click="closeModal"
            data-dismiss="modal"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axiosapi from "@/plugins/axios.js";
import Swal from "sweetalert2";

const comment = ref("");
const props = defineProps({
  workAdjustRequest: Object,
  actionType: String,
});

const emit = defineEmits(["update:workAdjustRequest"]);

const closeModal = () => {
  emit("update:workAdjustRequest", null);
  comment.value = "";
  // 手動關閉 Bootstrap modal (Bootstrap 4 寫法)
  const modal = document.getElementById("workAdjustModal");
  if (modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";
    // 移除 modal-backdrop
    const backdrops = document.getElementsByClassName("modal-backdrop");
    while (backdrops.length > 0) {
      backdrops[0].parentNode.removeChild(backdrops[0]);
    }
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-TW");
};

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  return new Date(dateTimeStr).toLocaleString("zh-TW");
};

const approveWorkAdjust = async () => {
  await reviewWorkAdjust("核准");
};

const rejectWorkAdjust = async () => {
  await reviewWorkAdjust("未核准");
};

const reviewWorkAdjust = async (status) => {
  if (!props.workAdjustRequest) return;
  try {
    const response = await axiosapi.put(
      `/api/approval/workadjust/step/${props.workAdjustRequest.stepId}/review`,
      null,
      {
        params: {
          approverId: props.workAdjustRequest.approverId,
          status: status,
          comment: comment.value,
        },
      }
    );
    Swal.fire({
      icon: "success",
      title: "操作成功",
      text: response.data,
    }).then(() => {
      closeModal();
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "操作失敗",
      text: error.response?.data || error.message,
    }).then(() => {
      closeModal();
    });
  }
};
</script>

<style scoped>
.modal-content {
  max-width: 600px;
}
</style>
