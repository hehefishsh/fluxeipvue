<template>
  <RouterView v-if="isLoginPage"></RouterView>
  <nav class="navbar-fixed sidebar-fixed" id="body">
    <Navbar v-if="!isLoginPage">
      <RouterView></RouterView>
    </Navbar>
  </nav>
  
  

</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "@/views/Navbar.vue";
import { computed } from 'vue';

const isLoginPage = computed(() => {
  return window.location.pathname === '/login';
});


/* 插件們*/
import "@/plugins/material/css/materialdesignicons.min.css";
import "simplebar/dist/simplebar.min.js";
import "simplebar/dist/simplebar.min.css";
import "@/plugins/hotkeys/hotkeys.min.js";
import "moment/moment.js"
import "daterangepicker/daterangepicker.js"
import "@/js/mono.js";
import "@/js/chart.js";
import "@/css/style.css";
import "@/plugins/nprogress/nprogress.css";
import "@/plugins/quill/quill.snow.css";
/* 插件們結束*/

</script>

<style>
/* 字體*/
@import url("https://fonts.googleapis.com/css?family=Karla:400,700|Roboto");

</style>
