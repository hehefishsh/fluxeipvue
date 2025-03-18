import LeaveRequestManage from "@/views/requestmanage/LeaveRequestManage.vue"
import LeaveRequestDetails from "./LeaveRequestDetails.vue";
import ExpenseRequestManage from "@/views/requestmanage/ExpenseRequestManage.vue";

const requestmanageRoutes = {
  path: "/requestmanage",
  name: "requestmanage",
  meta: { title: '申請表單' },
  children: [
    {
      path: "leave",
      name: "requestmanage-leave-link",
      component: LeaveRequestManage,
      meta: { title: '請假申請查詢' },
    },
    {
      path: 'leave-request-details/:id',
      name: 'LeaveRequestDetails',
      component: LeaveRequestDetails
    },
    {
      path: "expense",
      name: "requestmanage-expense-link",
      component: ExpenseRequestManage,
      meta: { title: '費用申請查詢' },
    },

  ],
};

export default requestmanageRoutes;
