<template>
    <div class="container">
      <h1>{{ isEdit ? "編輯公告" : "新增公告" }}</h1>
      <form @submit.prevent="submitForm">
        <div>
          <label>標題：</label>
          <input v-model="bulletin.title" required />
        </div>
        <div>
          <label>創建者：</label>
          <input v-model="bulletin.creator" required />
        </div>
        <div>
          <label>內容：</label>
          <textarea v-model="bulletin.content"></textarea>
        </div>
        <div>
          <label>狀態：</label>
          <select v-model="bulletin.statusId">
            <option value="1">草稿</option>
            <option value="2">已發布</option>
          </select>
        </div>
        <button type="submit">{{ isEdit ? "更新" : "提交" }}</button>
        <button type="button" @click="cancel">取消</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { getBulletinById, createBulletin, updateBulletin } from '@/services/bulletinService';
  
  export default {
    props: ['id'],
    setup(props) {
      const router = useRouter();
      const route = useRoute();
      const isEdit = ref(false);
      const bulletin = ref({ title: '', creater: '', content: '', statusId: 1 });
  
      onMounted(async () => {
        if (route.params.id) {
          isEdit.value = true;
          const response = await getBulletinById(route.params.id);
          bulletin.value = response.data;
        }
      });
  
      const submitForm = async () => {
        if (isEdit.value) {
          await updateBulletin(route.params.id, bulletin.value);
        } else {
          await createBulletin(bulletin.value);
        }
        router.push('/');
      };
  
      const cancel = () => {
        router.push('/');
      };
  
      return { bulletin, submitForm, cancel, isEdit };
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: auto;
    text-align: center;
  }
  form div {
    margin-bottom: 10px;
  }
  button {
    margin: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  </style>
  