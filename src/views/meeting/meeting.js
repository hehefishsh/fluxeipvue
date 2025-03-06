import MeetingCreate from "./MeetingCreate.vue";
import MeetingManage from "./MeetingManage.vue";

const meetingRoutes = {
  path: "/meeting",
  name: "meeting",
  meta: { title: '會議' },
  children: [
    {
      path: "manage",
      name: "meeting-manage-link",
      component: MeetingManage,
      meta: { title: '會議室管理' }
    },
    {
      path: "create",
      name: "meeting-create-link",
      component: MeetingCreate,
      meta: { title: '預約會議室' }
    },
  ],
};

export default meetingRoutes;
