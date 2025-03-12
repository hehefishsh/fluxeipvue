<template>
  <!-- <Navbar></Navbar> -->
  <div class="home">
    <h1>首頁</h1>
    <div class="page-container">
      <Clock></Clock>

      <!-- 可以添加更多小頁面組件 -->
    </div>
  </div>
</template>

<script setup>
import Clock from '@/views/attendance/Clock.vue';
import Navbar from "@/views/Navbar.vue";

</script>

<style></style>
