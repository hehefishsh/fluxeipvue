// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import useUserStore from "@/stores/user";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import attendanceRoutes from "@/views/attendance/attendance.js";
import requestformRoutes from "@/views/requestform/requestform";
import employeeRoutes from "@/views/Employee/employee.js";
import meetingRoutes from "@/views/meeting/meeting";
import guidelineRoutes from "@/views/guideline/guideline";
import bulletinRoutes from "@/views/bulletin/bulletin";
import BulletinList from "@/views/bulletin/BulletinList.vue";
import BulletinForm from "@/views/bulletin/BulletinForm.vue";




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
    meta: { title: "登入", hideNavbar: true },
  },
  { path: '/', component: BulletinList },
  { path: '/create', component: BulletinForm },
  { path: '/edit/:id', component: BulletinForm, props: true },
  attendanceRoutes,
  requestformRoutes,
  employeeRoutes,
  meetingRoutes,
  guidelineRoutes,
  bulletinRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 讓頁面標題，html head裡的title可以跟著變動
router.afterEach((to) => {
  document.title = to.meta.title || "預設標題";
});


//全域控制，如果沒有登入，就跳轉到登入頁面
router.beforeEach((to, from, next) => {
  const user = useUserStore();
  const isAuthenticated = !!user.token;

  if (to.path !== '/login' && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
