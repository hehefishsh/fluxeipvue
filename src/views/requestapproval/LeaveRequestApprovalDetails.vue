<template>
  <div v-if="leaveRequest" class="modal fade" id="leaveRequestModal" tabindex="-1"
    aria-labelledby="leaveRequestModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="leaveRequestModalLabel">請假詳情</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <table class="table table-borderless">
            <tbody>
              <tr>
                <td>申請Id</td>
                <td>{{ leaveRequest.leaveRequestId }}</td>
              </tr>
              <tr>
                <td>申請人</td>
                <td>{{ leaveRequest.requestEmployeeName }}</td>
              </tr>
              <tr>
                <td>請假類型</td>
                <td>{{ leaveRequest.leaveType }}</td>
              </tr>
              <tr>
                <td>開始時間</td>
                <td>{{ formatDate(leaveRequest.startDatetime) }}</td>
              </tr>
              <tr>
                <td>結束時間</td>
                <td>{{ formatDate(leaveRequest.endDatetime) }}</td>
              </tr>
              <tr>
                <td>請假時數</td>
                <td>{{ leaveRequest.leaveHours }}</td>
              </tr>
              <tr>
                <td>請假原因</td>
                <td>{{ leaveRequest.reason }}</td>
              </tr>
              <tr v-if="leaveRequest.attachmentName">
                <td>附件</td>
                <td>
                  <button @click="
                    downloadFile(
                      leaveRequest.attachmentName,
                      leaveRequest.attachmentPath
                    )
                    " class="badge badge-primary">
                    下載附件
                  </button>
                  {{ leaveRequest.attachmentName }}
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 新增評論輸入框 -->
          <div class="mb-3">
            <label for="comment" class="form-label">評論</label>
            <textarea v-model="comment" class="form-control" id="comment" rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="actionType === 'approve'" class="btn btn-success" @click="approveLeave">
            核准
          </button>
          <button v-if="actionType === 'reject'" class="btn btn-warning" @click="rejectLeave">
            否決
          </button>
          <button class="btn btn-danger" @click="closeModal" data-dismiss="modal">
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
const comment = ref(""); // 新增評論變數
const props = defineProps({
  leaveRequest: Object,
  actionType: String,
});

const emit = defineEmits(["update:leaveRequest"]);

const closeModal = () => {
  emit("update:leaveRequest", null);
  comment.value = ""; // 清空評論

  // 手動關閉 Bootstrap modal
  const modal = document.getElementById("leaveRequestModal");
  if (modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";

    // 手動移除 modal-backdrop，避免畫面卡住
    const backdrops = document.getElementsByClassName("modal-backdrop");
    while (backdrops.length > 0) {
      backdrops[0].parentNode.removeChild(backdrops[0]);
    }

    // 讓 body 滾動恢復
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date
    .toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "");
};

const approveLeave = async () => {
  await reviewLeave("核准"); // 1 代表核准
};

const rejectLeave = async () => {
  await reviewLeave("未核准"); // 2 代表否決
};

const reviewLeave = async (status) => {
  if (!props.leaveRequest) return;
  try {
    const response = await axiosapi.put(
      `/api/approval/step/${props.leaveRequest.stepId}/review`,
      null,
      {
        params: {
          approverId: props.leaveRequest.approverId,
          status: status,
          comment: comment.value, // 傳遞評論
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

const downloadFile = (attachmentName, attachmentPath) => {
  axiosapi
    .get(`/api/leave-requests/attachments/${attachmentPath}`, {
      responseType: "blob",
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
};
</script>

<style scoped>
.modal-content {
  max-width: 600px;
}
</style>
