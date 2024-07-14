/** @format */

import axios from "axios";
import router from "../router";

// let loading: { close: () => void };

// function startLoading() {
//   loading = vLoading.service({
//     lock: true,
//     text: "拼命加载中...",
//     // spinner: 'el-icon-loading',
//     background: "rgba(0, 0, 0, 0.7)",
//   });
// }

// function endLoading() {
//   loading.close();
// }
// 创建axios实例
const service = axios.create({
  baseURL: "http://localhost:5050", // API的基础URL
  timeout: 5000, // 请求超时时间
});
//请求拦截
service.interceptors.request.use(
  (config) => {
    //加载动画
    // startLoading();

    if (localStorage.eletoken) {
      //设置请求统一的请求header
      config.headers.Authorization = localStorage.eletoken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//相应拦截
service.interceptors.response.use(
  (response) => {
    //结束动画
    // endLoading();
    return response;
  },
  (error) => {
    //错误提醒
    // endLoading();
    // Message.error(error.response.data);
    //获取错误状态码
    const { status } = error.response;
    if (status == 401) {
      // Message.error("token失效，请重新登陆！");
      //清除token
      localStorage.removeItem("eletoken");
      //跳转到登陆页面
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export { service };
