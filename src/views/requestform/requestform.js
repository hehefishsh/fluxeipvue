import LeaveRequest from "./LeaveRequest.vue";

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
    // {
    //   path: "log",
    //   name: "attendance-log-link",
    //   component: AttendanceLog,
    //   meta: { title: '出勤記錄查詢' },
    // },
  ],
};

export default requestformRoutes;
