<template>
  <div class="index">
    <HeadNav></HeadNav>
    <LeftMenu></LeftMenu>
    <div class="rightContainer">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import HeadNav from "../components/HeadNav.vue"
import LeftMenu from "../components/LeftMenu.vue"
</script>

<style scoped>
.index {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.rightContainer {
  position: relative;
  top: 0;
  left: 64px;
  width: calc(100% - 64px);
  height: calc(100% - 71px);
  overflow: auto;
}
</style>

