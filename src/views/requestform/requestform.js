import LeaveRequest from "./LeaveRequest.vue";
import WorkAdjustRequest from "./WorkAdjustRequest.vue";
import ExpenseRequest from "./ExpenseRequest.vue";

const requestformRoutes = {
  path: "/requestform",
  name: "requestform",
  meta: { title: '申請表單' },
  children: [
    {
      path: "leave",
      name: "requestform-leave-link",
      component: LeaveRequest,
      meta: { title: '請假申請' },
    },
    {
      path: "workadjust",
      name: "requestform-workadjust-link",
      component: WorkAdjustRequest,
      meta: { title: '加減班申請' },
    },
    {
      path: "expense",
      name: "requestform-expense-link",
      component: ExpenseRequest,
      meta: { title: '費用申請' },
    },

  ],
};

export default requestformRoutes;
