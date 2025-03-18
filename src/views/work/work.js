import workProgress from "@/views/work/workProgress.vue";

const workpro = {
    path: "/work",
    name: "work",
    meta: { title: "工作事項" },
    children: [
        {
            path: "progress",
            name: "workprogress-link",
            component: workProgress,
            meta: { title: "所有工作" },
            // 移除了 beforeEnter，表示所有人都可以訪問
        }
    ],
};

export default workpro;