<template>
  <RouterLink class="btn btn-primary btn-pill" to="/bulletin/create">
    <span class="nav-text">新增公告</span>
          </RouterLink>
  <div class="card card-default">
    <table>
      <thead>
        <tr>
          <th>標題</th>
          <th>創建者</th>
          <th>內容</th>
          <th>狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bulletin in bulletins" :key="bulletin.id">
          <td>
            <!-- 點擊標題進入詳細頁 -->
            <a @click="viewBulletin(bulletin.id)" class="title-link">{{ bulletin.title }}</a>
          </td>
          <td>{{ bulletin.creater }}</td>
          <td>
            <div class="content-preview">
              {{ bulletin.content.length > 20 ? bulletin.content.substring(0, 20) + "..." : bulletin.content }}
            </div>
          </td>
          <td>{{ bulletin.statusId === 1 ? "草稿" : "已發布" }}</td>
          <td>
            <button class="btn edit-btn" @click="editBulletin(bulletin.id)">
    ✏️ 編輯
  </button>
  <button class="btn delete-btn" @click="deleteBulletin(bulletin.id)">
    🗑️ 刪除
  </button>

          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import axiosapi from "@/plugins/axios-login";

export default {
  setup() {
    const bulletins = ref([]);
    const router = useRouter();

    const fetchBulletins = async () => {
      try {
        const response = await axiosapi.get("/bulletin");
        bulletins.value = response.data;
      } catch (error) {
        console.error("取得公告列表失敗:", error);
      }
    };

    const viewBulletin = (id) => {
      router.push(`/bulletin/${id}`);
    };

    const editBulletin = (id) => {
      router.push(`/edit/${id}`);
    };

    const goToCreate = () => {
      router.push('/create');
    };

    const removeBulletin = async (id) => {
  Swal.fire({
    title: "確定要刪除嗎？",
    text: "刪除後將無法恢復！",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "刪除！",
    cancelButtonText: "取消"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteBulletin(id); // 執行刪除請求
        Swal.fire("刪除成功！", "公告已被刪除。", "success");
        fetchBulletins(); // 刪除後刷新列表
      } catch (error) {
        console.error("刪除公告失敗:", error);
        Swal.fire("刪除失敗！", "請稍後再試。", "error");
      }
    }
  });
};

    onMounted(fetchBulletins);

    return { bulletins, viewBulletin, editBulletin, goToCreate, deleteBulletin: removeBulletin };
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  
  padding: 8px;
}

/* 限制「內容」欄位的顯示 */
.content-preview {
  max-width: 200px;
  max-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 限制「操作」欄位的寬度 */
th:last-child,
td:last-child {
  width: 200px; /* 讓操作按鈕的欄位變小 */
  text-align: center;
  color:black;
}

/* 設計按鈕 */
button, .title-link {
  cursor: pointer;
}

.title-link {
  color: blue;
  text-decoration: underline;
}

/* 調整按鈕大小，讓它們不佔太多空間 */
.edit-btn, .delete-btn {
  padding: 5px 8px;
  border: 2px solid #f0a720;  /* 加上邊框 */
  font-size: 12px;
  margin: 2px;
}

/* 按鈕間距縮小 */
td:last-child button {
  display: inline-block;
}
</style>
