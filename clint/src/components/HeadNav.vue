<template>
  <header class="head-nav">
    <el-row>
      <el-col :span="6" class="logo-container">
        <img src="../assets/earth.png" class="logo" alt="" />
        <span class="title"> WebGIS 地图展示系统</span>
      </el-col>
      <el-col :span="6" class="user">
        <div class="userinfo">
          <div class="welcome">
            <p class="name comename">Welcome</p>
            <p class="name avatarname">{{ user.name }}</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="user">
        <span class="username">
          <el-dropdown>
            <span class="el-dropdown-link user">
              <el-icon><User /></el-icon>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu
                trigger="click"
                @command="setDialogInfo"
                class="user"
              >
                <el-dropdown-item command="info">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- <el-dropdown trigger="click" @command="setDialogInfo">
              <span class="el-dropdown-link">
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="info">个人信息</el-dropdown-item>
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown> -->
        </span>
      </el-col>
    </el-row>
  </header>
</template>
<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../store/auth"
const router = useRouter()
const authStore = useAuthStore()
const user = ref(authStore.user)

const setDialogInfo = (cmditem) => {
  if (!cmditem) {
    console.log("test")
    ElMessage("菜单选项缺少command属性")
    return
  }
  switch (cmditem) {
    case "info":
      showInfoList()
      break
    case "logout":
      logout()
      break
  }
}
const showInfoList = () => {
  // 个人信息
  router.push("/infoshow")
}

const logout = () => {
  localStorage.removeItem("eleToken")
  this.$store.dispatch("clearCurrentState")

  // 页面跳转
  router.push("/login")
}
// export default {
//   name: "head-nav",
//   computed: {
//     user() {
//       return this.$store.getters.user;
//     }
//   },
//   methods: {
//     setDialogInfo(cmditem) {
//       if (!cmditem) {
//         console.log("test");
//         this.$message("菜单选项缺少command属性");
//         return;
//       }
//       switch (cmditem) {
//         case "info":
//           this.showInfoList();
//           break;
//         case "logout":
//           this.logout();
//           break;
//       }
//     },
//     showInfoList() {
//       // 个人信息
//       this.$router.push("/infoshow");
//     },
//     logout() {
//       // 清除token
//       localStorage.removeItem("eleToken");
//       this.$store.dispatch("clearCurrentState");

//       // 页面跳转
//       this.$router.push("/login");
//     }
//   }
// };
</script>

<style scoped>
.head-nav {
  width: 100%;
  height: 60px;
  min-width: 600px;
  padding: 5px;
  background: #324057;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;
}
.logo-container {
  line-height: 60px;
  min-width: 400px;
}
.logo {
  height: 50px;
  width: 50px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}
.title {
  vertical-align: middle;
  font-size: 22px;
  font-family: "Microsoft YaHei";
  letter-spacing: 3px;
}
.user {
  line-height: 60px;
  text-align: right;
  float: right;
  padding-right: 10px;
}
.welcome {
  display: inline-block;
  width: auto;
  vertical-align: middle;
  padding: 0 5px;
}
.name {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
}
.comename {
  font-size: 14px;
  font-weight: bolder;
}
.avatarname {
  color: #409eff;
  font-weight: bolder;
}
.username {
  cursor: pointer;
  margin-right: 5px;
}
.el-dropdown {
  color: #fff;
}
</style>
