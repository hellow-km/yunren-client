import { defineStore } from "pinia";

export const useHttpStore = defineStore("http", {
  state: () => ({
    isRequested: false,
  }),
  getters: {},
  actions: {},
});
