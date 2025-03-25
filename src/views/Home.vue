<template>
  <!-- <Navbar></Navbar> -->
  <div class="content-wrapper">
    <div class="content">
      <div class="row">
        <div class="col-xl-4">
          <div class="card card-default" id="leave-request-query">
            <div class="card-header">
              <h2>打卡</h2>
            </div>
            <div class="card-body py-0" data-simplebar>
              <Clock></Clock>
            </div>
          </div>
        </div>
        <div class="col-xl-3">
          <div class="card card-default" id="leave-request-query">
            <div class="card-header">
              <h2>工作事項</h2>
            </div>
            <div class="card-body py-0" data-simplebar>
              <WorkProgress></WorkProgress>
            </div>
          </div>
        </div>
        <div class="col-xl-5">
          <div class="card card-default" id="leave-request-query">
            <div class="card-header">
              <h2>工作事項</h2>
            </div>
            <div class="card-body py-0" data-simplebar>
              <BulletinList></BulletinList>
            </div>
          </div>
        </div>
        <!-- 可以添加更多小頁面組件 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import Clock from "@/views/attendance/Clock.vue";
import WorkProgress from "./work/workProgress.vue";
import BulletinList from "./bulletin/BulletinList.vue";
</script>

<style></style>
