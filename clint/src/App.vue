<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script lang="ts">
// import { onMounted } from "vue"
// import { useStore } from "vuex"
// import jwt_decode from "jwt-decode"

// const store = useStore()

// onMounted(() => {
//   if (localStorage.eletoken) {
//     const decode = jwt_decode(localStorage.eletoken)
//     store.dispatch("setIsAutnenticated", !isEmpty(decode))
//     store.dispatch("setUser", decode)
//   }
// })

// function isEmpty(value) {
//   return (
//     value === undefined ||
//     value === null ||
//     (typeof value === "object" && Object.keys(value).length === 0) ||
//     (typeof value === "string" && value.trim().length === 0)
//   )
// }
</script>
<style scoped>
#app {
  display: flex;
  flex-direction: column; /* 根据需要调整布局方向 */
  min-height: 100vh; /* 设置最小高度为视口的高度，确保填满整个屏幕 */
  width: 100vw; /* 设置宽度为视口宽度 */
}
</style>
