import GuidelineAll from "./GuidelineAll.vue";

const guidelineRoutes = {
  path: "/guideline",
  name: "guideline",
  meta: { title: '智庫' },
  children: [
    {
      path: "all",
      name: "guideline-all-link",
      component: GuidelineAll,
      meta: { title: '智庫總覽' }
    },
  ],
};

export default guidelineRoutes;
