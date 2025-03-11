import GuidelineAll from "./GuidelineAll.vue";
import GuidelineDetail from "./GuidelineDetail.vue";
import GuidelineUpdate from "./GuidelineUpdate.vue";

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
    {
      path: "detail/:id",  // 動態路由，會接收 id 參數
      name: "guideline-detail-link",
      component: GuidelineDetail,
      meta: { title: '智庫詳細' }
    },
    {
      path: 'guidelineUupdate',
      name: 'guideline-update-link',
      component: GuidelineUpdate,
      meta: { title: '智庫編輯' }
    }
  ],
};

export default guidelineRoutes;
