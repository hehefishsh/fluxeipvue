import workProgress from "@/views/work/workProgress.vue";
import workDetail from "./workDetail.vue";
import workCreate from "./workCreate.vue";
import Taskprogress from "./Taskassign.vue";
import workUpdate from "./workUpdate.vue";

const workpro = {
    path: "/work",
    name: "work",
    meta: { title: "工作事項" },
    children: [
        {
            path: "progress",
            name: "workprogress-link",
            component: workProgress,
            meta: { title: "所有工作" }
        },
        {
            path: "progress/detail/:id",
            name: "workprogressdetail-link",
            component: workDetail,
            meta: { title: "工作分配" }
        },
        {
            path: "progress/create",
            name: "workprogresscreate-link",
            component: workCreate,
            meta: { title: "新增工作" }
        },
        {
            path: "taskprogress",
            name: "taskprogress-link",
            component: Taskprogress,
            meta: { title: "交辦事項" }
        },
        {
            path: "progress/update/:id",
            name: "taskprogressupdate-link",
            component: workUpdate,
            meta: { title: "修改工作" }
        }
    ],
};

export default workpro;