<template>
    <div class="container">
      <h1>公告列表</h1>
      <button @click="goToCreate">新增公告</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>標題</th>
            <th>創建者</th>
            <th>內容</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bulletin in bulletins" :key="bulletin.id">
            <td>{{ bulletin.id }}</td>
            <td>{{ bulletin.title }}</td>
            <td>{{ bulletin.creater }}</td>
            <td>{{ bulletin.content }}</td>
            <td>{{ bulletin.statusId }}</td>
            <td>
              <button @click="editBulletin(bulletin.id)">編輯</button>
              <button @click="deleteBulletin(bulletin.id)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { getBulletins, deleteBulletin } from '@/services/bulletinService';
  
  export default {
    setup() {
      const bulletins = ref([]);
      const router = useRouter();
  
      const fetchBulletins = async () => {
        const response = await getBulletins();
        bulletins.value = response.data;
      };
  
      const editBulletin = (id) => {
        router.push(`/edit/${id}`);
      };
  
      const goToCreate = () => {
        router.push('/create');
      };
  
      const removeBulletin = async (id) => {
        await deleteBulletin(id);
        fetchBulletins();
      };
  
      onMounted(fetchBulletins);
  
      return { bulletins, editBulletin, goToCreate, deleteBulletin: removeBulletin };
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
    border: 1px solid #ddd;
    padding: 8px;
  }
  button {
    margin: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  </style>
  