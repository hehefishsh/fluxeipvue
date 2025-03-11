import EmployeeSearch from "@/views/employee/manage/EmployeeSearch.vue";

import EmployeeCreate from "@/views/employee/manage/EmployeeCreate.vue";
import EmployeeDetail from "@/views/employee/EmployeeDetail.vue";

const routes = [
  { path: "detail", component: EmployeeDetail, name: "employee-detail-link", meta: { title: '個人資訊' } },
  { path: "manage/search", component: EmployeeSearch, name: "employee-manage-search-link", meta: { title: '員工查詢' } },
  { path: "manage/create", component: EmployeeCreate, name: "employee-manage-create-link", meta: { title: '員工新增' } },
]

const employeeRoutes = {
  path: "/employee",
  name: "employee",
  meta: { title: '員工管理' },
  children: routes
};

export default employeeRoutes;
