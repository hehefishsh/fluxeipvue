import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue"
import Clock from "@/views/Clock.vue";
import EmployeeCreate from "@/views/Employee/EmployeeCreate.vue";
import EmployeeDetail from "@/views/Employee/EmployeeDetail.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/", component: Home,
      name: "home-link", meta: { title: '首頁' }
    },
    {
      path: "/clock",
      name: "clock-link",
      component: Clock,
      meta: { title: '打卡' },
    },
    {
      path: "/employee/detail",
      name: "employee-detail",
      component: EmployeeDetail,
      meta: { title: '個人資訊' }
    },
    {
      path: "/employee/create",
      name: "employee-create-link",
      component: EmployeeCreate,
      meta: { title: '員工新增' }
    },

  ],
});

export default router;
