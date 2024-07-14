/** @format */

import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import cors from "cors";
const app = express();
app.use(cors());
// 引入keys.ts
import { mongooseURI as db } from "./config/keys";
// 引入users.ts
import users from "./src/api/users";

// MongoDB数据库连接
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 解析 application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// 解析 application/json
app.use(express.json());

// 初始化 Passport
app.use(passport.initialize());

// 代码抽离，将passport对象直接引到其他地方来写
import passportConfig from "./config/passport";

passportConfig(passport);

// 使用routers
app.use("/api/users", users);

const port = process.env.PORT || 5050;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
