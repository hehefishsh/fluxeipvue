// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import attendanceRoutes from "@/views/attendance/attendance.js";
import employeeRoutes from "@/views/employee/employee.js";


const routes = [
  {
    path: "/", 
    component: Home,
    name: "home-link", 
    meta: { title: '首頁' }
  },
  attendanceRoutes,
  employeeRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
