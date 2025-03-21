import LeaveRequestApproval from "./LeaveRequestApproval.vue";
import LeaveRequestApprovalDetails from "./LeaveRequestApprovalDetails.vue";

const requestapprovalRoutes = {
  path: "/requestapproval",
  name: "requestapproval",
  meta: { title: '簽核表單' },
  children: [
    {
      path: "leave",
      name: "requestapproval-leave-link",
      component: LeaveRequestApproval,
      meta: { title: '請假簽核' },
    },
    {
      path: 'leave-request-approval-details/:id',
      name: 'LeaveRequestApprovalDetails',
      component: LeaveRequestApprovalDetails
    },


  ],
};

export default requestapprovalRoutes;
