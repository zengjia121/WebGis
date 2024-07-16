<template>
  <div class="container">
    <div class="login-box">
      <!-- Login Form -->
      <el-form
        :model="registerUser"
        :rules="rules"
        class="registerForm"
        ref="registerForm"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="name" class="input-box">
          <input
            v-model="registerUser.name"
            placeholder="请输入用户名"
          ></input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" class="input-box">
          <input
            v-model="registerUser.email"
            placeholder="请输入邮箱"
          ></input>
        </el-form-item>
        <el-form-item label="密码" prop="password" class="input-box">
          <input
            v-model="registerUser.password"
            placeholder="请输入密码"
            type="password"
          ></input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2" class="input-box">
          <input
            v-model="registerUser.password2"
            placeholder="请确认密码"
            type="password"
          ></input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="submit_btn"
            @click="submitForm('registerForm')"
            >注 册</el-button
          >
        </el-form-item>
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
import { useAuthStore } from "../store/auth"
import { jwtDecode } from "jwt-decode"

const router = useRouter()
const authStore = useAuthStore()
// const formName = ref("") // 假设你有一个表单名称
const registerForm = ref(null) // 用于访问表单的引用
const registerUser = reactive({
  name: "",
  email: "",
  password: "",
  password2: "",
})
const validatePass2 = async (rule, value) => {
  if (value !== registerUser.password) {
    return Promise.reject(new Error("两次输入密码不一致!"))
  } else {
    return Promise.resolve()
  }
}
const rules = reactive({
  name: [
    { required: true, message: "用户名不能为空", trigger: "change" },
    { min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur" },
  ],
  email: [
    {
      type: "email",
      required: true,
      message: "邮箱格式不正确",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" },
  ],
  password2: [
    { required: true, message: "确认密码不能为空", trigger: "blur" },
    { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" },
    { validator: validatePass2, trigger: "blur" },
  ],
})
const submitForm = async () => {
  const valid = await registerForm.value.validate()
  if (valid) {
    try {
      const res = await service.post("/api/users/register", registerUser)
      router.push("/login")
    } catch {
      console.error("注册失败:")
    }
  }
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
#el-id-1158-2
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
</style>