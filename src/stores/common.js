import { defineStore } from "pinia";

export const useCommonStore = defineStore("common", {
  state: () => ({
    loginVisible: false,
    footerShow: true,
    IP: "",
  }),
  getters: {},
  actions: {
    setData(data) {
      Object.assign(this, data);
    },
    onSetFooterShow() {
      // const container = document.getElementsByClassName("page-main")[0];
      // if (container) {
      //   const scrollHeight = container.scrollHeight;
      //   const scrollTop = container.scrollTop;
      //   const clientHeight = container.clientHeight;
      //   // 当滚动条到达底部时
      //   if (scrollHeight - scrollTop <= clientHeight) {
      //     this.footerShow = true;
      //   } else {
      //     this.footerShow = false;
      //   }
      // }
    },
  },
});
