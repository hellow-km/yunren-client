import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useHttpStore } from "src/stores/http";
import { useCommonStore } from "src/stores/common";
import { nextTick } from "vue";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = createWebHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
    base: process.env.NODE_ENV === "production" ? "/electron/1.0.1/" : "/",
  });
  Router.beforeEach((to, form, next) => {
    if (to.meta) {
      let { desc, keywords, title } = to.meta;
      if (!keywords) {
        keywords =
          "网站工具,图片工具,在线工具,website tools,online tools,image tools";
      }
      if (!desc) {
        desc =
          "网站工具,图片工具,在线工具,website tools,online tools,image tools";
      }

      let keywordsMetaTag = document.querySelector('meta[name="keywords"]');
      if (!keywordsMetaTag) {
        keywordsMetaTag = document.createElement("meta");
        keywordsMetaTag.name = "keywords";
        document.head.appendChild(keywordsMetaTag);
      }
      keywordsMetaTag.content = keywords;

      let descriptionMetaTag = document.querySelector(
        'meta[name="description"]'
      );
      if (!descriptionMetaTag) {
        descriptionMetaTag = document.createElement("meta");
        descriptionMetaTag.name = "description";
        document.head.appendChild(descriptionMetaTag);
      }
      descriptionMetaTag.content = desc;
      if (title) {
        document.title = title;
      } else {
        document.title = "云任工具";
      }
    }

    useHttpStore().isRequested = true;
    next();
  });
  Router.afterEach((to, form, next) => {
    nextTick(() => {
      useCommonStore().onSetFooterShow();
    });

    useHttpStore().isRequested = false;
  });
  return Router;
});
