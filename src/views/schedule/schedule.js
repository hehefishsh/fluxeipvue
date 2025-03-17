import Schedule from "./Schedule.vue";
import ShiftType from "./ShiftType.vue";
import scheduleDetail from "./scheduleDetail.vue";
import ShiftTypeEdit from "./ShiftTypeEdit.vue";
import ShiftTypeEditById from "./ShiftTypeEditById.vue";

const scheduleRoutes = {
    path: "/schedule",
    name: "schedule",
    meta: { title: '排班' },
    children: [
        {
            path: "shiftType",
            name: "schedule-shiftType-link",
            component: ShiftType,
            meta: { title: '班別' }
        },
        {
            path: "shiftType/edit",
            name: "schedule-shiftType-edit-link",
            component: ShiftTypeEdit,
            meta: { title: '班別新增' }
        },
        {
            path: "shiftType/edit/:id",
            name: "schedule-shiftType-edit-id-link",
            component: ShiftTypeEditById,
            meta: { title: '班別編輯' }
        },
        {
            path: "create",
            name: "schedule-create-link",
            component: Schedule,
            meta: { title: '排班功能' }
        },
        {
            path: "detail",
            name: "schedule-detail-link",
            component: scheduleDetail,
            meta: { title: '排班查詢' }
        }
    ]
};

export default scheduleRoutes;