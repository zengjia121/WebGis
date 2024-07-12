/** @format */

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import passport from "passport";
const app = express();

// 引入keys.ts
import { mongooseURI as db } from "./config/keys";
// 引入users.ts
import users from "./src/api/users";

// MongoDB数据库连接
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// express使用bodyparser中间件,用来解析不同数据格式
// parse application/x-www-form-urlencoded
// 经过这个中间件后，就可以在所有路由处理器的req.body中访问请求参数
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// passport初始化
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
