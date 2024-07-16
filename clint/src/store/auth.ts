/** @format */

import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAutnenticated: false, // 是否认证
    user: localStorage.getItem("eletoken") ? jwtDecode(localStorage.getItem("eletoken")) : {}, // 存储用户信息
  }),
  actions: {
    setIsAutnenticated(isAutnenticated: boolean) {
      this.isAutnenticated = isAutnenticated !== undefined ? isAutnenticated : false;
    },
    setUser(info: any) {
      // 确保info总是一个对象
      this.user = info;
    },
    clearCurrentState() {
      this.isAutnenticated = false;
      this.user = {};
    },
  },
});
