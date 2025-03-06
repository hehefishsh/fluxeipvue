import Bulletin from "./Bulletin.vue";

const bulletinRoutes = {
  path: "/bulletin",
  name: "bulletin",
  meta: { title: '公佈欄' },
  children: [
    {
      path: "",
      name: "bulletin-link",
      component: Bulletin,
      meta: { title: '公佈欄' }
    },
  ],
};

export default bulletinRoutes;
