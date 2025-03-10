// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import attendanceRoutes from "@/views/attendance/attendance.js";
import employeeRoutes from "@/views/employee/employee.js";
import meetingRoutes from "@/views/meeting/meeting";
import guidelineRoutes from "@/views/guideline/guideline";
import bulletinRoutes from "@/views/bulletin/bulletin";

const routes = [
  {
    path: "/",
    component: Home,
    name: "home-link",
    meta: { title: "首頁" },
  },
  {
    path: "/login",
    component: Login,
    name: "login-link",
    meta: { title: "登入" },
  },
  attendanceRoutes,
  employeeRoutes,
  meetingRoutes,
  guidelineRoutes,
  bulletinRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
