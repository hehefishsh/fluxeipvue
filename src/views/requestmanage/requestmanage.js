import LeaveRequestManage from "@/views/requestmanage/LeaveRequestManage.vue"
import LeaveRequestDetails from "./LeaveRequestDetails.vue";
import ExpenseRequestManage from "@/views/requestmanage/ExpenseRequestManage.vue";
import WorkAdjustmentManage from "./WorkAdjustmentManage.vue";
import WorkAdjustmentDetails from "./WorkAdjustmentDetails.vue";
import MissingPunchManage from "./MissingPunchManage.vue";
import MissingPunchDetails from "./MissingPunchDetails.vue";

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
      path: "workadjust",
      name: "requestmanage-workadjust-link",
      component: WorkAdjustmentManage,
      meta: { title: '加減班申請查詢' },
    },
    {
      path: "missingpunch",
      name: "requestmanage-missingpunch-link",
      component: MissingPunchManage,
      meta: { title: '補卡申請查詢' },
    },
    {
      path: 'leave-request-details/:id',
      name: 'LeaveRequestDetails',
      component: LeaveRequestDetails
    },
    {
      path: 'work-adjustment-details/:id',
      name: 'WorkAdjustmentDetails',
      component: WorkAdjustmentDetails
    },
    {
      path: 'missingpunch-details/:id',
      name: 'MissingPunchDetails',
      component: MissingPunchDetails
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
