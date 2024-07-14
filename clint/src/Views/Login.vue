<template>
  <div class="container">
    <div class="login-box">
      <!-- Login Form -->
      <el-form
        :model="loginUser"
        :rules="rules"
        ref="loginForm"
        class="loginForm"
        label-width="60px"
      >
        <el-form-item label="邮箱" prop="email" class="input-box">
          <input
            type="email"
            required
            placeholder="Email"
            v-model="loginUser.email"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password" class="input-box">
          <input
            type="password"
            placeholder="Password"
            required
            v-model="loginUser.password"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" class="submit_btn"
            >登录</el-button
          >
        </el-form-item>
        <div class="tiparea register-link">
          <p>
            还没有账号？现在
            <router-link to="/register">注册</router-link>
          </p>
        </div>
      </el-form>
      <!-- <form action="">
        <h2>Login</h2>
        <div class="input-box">
          <span class="icon"><i class="fa-solid fa-envelope"></i></span>
          <input type="email" required placeholder="Email" />
        </div>
        <div class="input-box">
          <span class="icon"><i class="fa-solid fa-lock"></i></span>
          <input type="password" placeholder="Password" required />
        </div>
        <div class="remember-forget">
          <label><input type="checkbox" />Remember Me</label>
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit">Login</button>
        <div class="register-link">
          <a href="#">Don't have an account? Create Now!</a>
        </div>
      </form> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from "vue"
import { useRouter } from "vue-router"
import { service } from "../api/request"
// import { useStore } from "vuex"
import jwt_decode from "jwt-decode"

const router = useRouter()
// const store = useStore();
const formName = ref("") // 假设你有一个表单名称
const formRef = ref(null) // 用于访问表单的引用
const loginUser = reactive({
  email: "",
  password: "",
})
const rules = reactive({
  email: [
    {
      type: "email",
      required: true,
      message: "邮箱格式不正确",
      trigger: "change",
    },
  ],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    {
      min: 6,
      max: 30,
      message: "长度在 6 到 30 个字符",
      trigger: "blur",
    },
  ],
})
const submitForm = async () => {
  // const valid = await formRef.value.validate()
  const valid = true
  if (valid) {
    try {
      console.log("登录成功:", toRefs(loginUser))
      const res = await service.post("/api/users/login", loginUser)

      const { token } = res.data
      localStorage.setItem("eletoken", token)
      // const decode = jwt_decode(token)
      // console.log(decode)
      // store.dispatch("setIsAuthenticated", !isEmpty(decode))
      // store.dispatch("setUser", decode)
      router.push("/index")
    } catch (error) {
      console.error("登录失败:", error)
    }
  } else {
    console.log("error submit!!")
    return false
  }
}
const isEmpty = (value: any) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  )
}
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap");

/* General CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

/* Custom CSS */
.container {
  width: 100vw;
  height: 100vh;
  background: url("../assets/bg-img.jpg") no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container .login-box {
  position: relative;
  width: 390px;
  height: 420px;
  background-color: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(15px);
}

.login-box h2 {
  font-size: 28px;
  color: #fff;
  text-align: center;
}

.login-box .input-box {
  position: relative;
  width: 310px;
  margin: 30px 0;
  border-bottom: 2px solid #fff;
}

.input-box input {
  width: 100%;
  height: 50px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  color: #fff;
  padding: 0 35px 0 5px;
}

.input-box input::placeholder {
  color: #f9f9f9;
}

.input-box .icon {
  position: absolute;
  right: 8px;
  color: #fff;
  font-size: 18px;
  line-height: 50px;
}

.login-box .remember-forget {
  margin: -15px 0 15px;
  font-size: 15px;
  color: #fff;
  display: flex;
  justify-content: space-between;
}

.remember-forget label input {
  margin-right: 3px;
}

.login-box button {
  width: 100%;
  height: 40px;
  margin-left: -25px;
  background: #fff;
  border: none;
  outline: none;
  border-radius: 40px;
  cursor: pointer;
  font-size: 16px;
  color: #000;
  transition: all 0.5s;
}

.login-box button:hover {
  background: #1f73c9;
  color: #fff;
}

.login-box .register-link {
  font-size: 15px;
  color: #fff;
  text-align: center;
  margin-left: -25px;
  margin-top: 20px;
}

.remember-forget a,
.register-link a {
  color: #7081ff;
  text-decoration: none;
}

.remember-forget a:hover,
.register-link a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 460px) {
  .container .login-box {
    width: 350px;
  }

  .login-box .input-box {
    width: 290px;
  }
}

@media (max-width: 360px) {
  .container .login-box {
    width: 100%;
    height: 100vh;
    border: none;
  }
}
</style>async 