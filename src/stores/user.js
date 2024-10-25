import { defineStore } from "pinia";
import { config } from "src/config";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {},
    isLogin: false,
    isVip: false,
  }),
  getters: {},
  actions: {
    setUser(user) {
      this.user = user;
      user.avartar =
        user.avartar ||
        config.serverUrl + "uploadImages/basic/user-default.jpg";
      let isVip = false;
      if (user.expTime) {
        isVip = new Date(user.expTime * 1000).getTime() - new Date().getTime();
      }
      this.isVip = isVip;
      localStorage.setItem("_user", JSON.stringify(user));
    },
    setIslogin(isLogin) {
      this.isLogin = isLogin;
    },
    logout() {
      this.user = {};
      this.isLogin = false;
      this.isVip = false;
      localStorage.removeItem("_item");
      localStorage.removeItem("token");
    },
  },
});
