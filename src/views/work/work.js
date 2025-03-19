import workProgress from "@/views/work/workProgress.vue";
import workDetail from "./workDetail.vue";

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
        }
    ],
};

export default workpro;