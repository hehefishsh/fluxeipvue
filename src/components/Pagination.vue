<template>
    <div class="pagination-container" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="currentPage === 1">«</button>
  
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
  
      <button @click="nextPage" :disabled="currentPage === totalPages">»</button>
    </div>
  </template>
  
  <script setup>
  import { computed } from "vue";
  
  const props = defineProps({
    totalItems: Number,
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    modelValue: Number
  });
  
  const emit = defineEmits(["update:modelValue"]);
  
  const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));
  const currentPage = computed(() => props.modelValue);
  
  function changePage(page) {
    emit("update:modelValue", page);
  }
  function prevPage() {
    if (currentPage.value > 1) {
      changePage(currentPage.value - 1);
    }
  }
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      changePage(currentPage.value + 1);
    }
  }
  </script>
  
  <style scoped>
  .pagination-container {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 20px;
  }
  button {
    padding: 6px 12px;
    border: none;
    background-color: #eee;
    border-radius: 4px;
    cursor: pointer;
  }
  button.active {
    background-color: #409eff;
    color: white;
    font-weight: bold;
  }
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>
  