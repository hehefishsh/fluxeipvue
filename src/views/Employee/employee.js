// src/router/employee.js
import EmployeeSearch from "@/views/employee/manage/EmployeeSearch.vue";
import EmployeeCreate from "@/views/employee/manage/EmployeeCreate.vue";
import EmployeeDetail from "@/views/employee/EmployeeDetail.vue";

const employeeRoutes = {
  path: "/employee",
  name: "employee",
  meta: { title: '員工管理' },
  children: [
    {
      path: "detail",
      name: "employee-detail-link",
      component: EmployeeDetail,
      meta: { title: '個人資訊' }
    },
    {
      path: "manage/search",
      name: "employee-manage-search-link",
      component: EmployeeSearch,
      meta: { title: '員工查詢' }
    },
    {
      path: "manage/create",
      name: "employee-manage-create-link",
      component: EmployeeCreate,
      meta: { title: '員工新增' }
    },
  ],
};

export default employeeRoutes;
