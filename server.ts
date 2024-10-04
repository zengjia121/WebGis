/** @format */

import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";

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
// 创建 HTTP 服务器
const server = createServer(app);

// 创建 WebSocket 服务器
const wss = new WebSocketServer({ server });
console.log(wss);
wss.on("listening", () => {
  console.log("WebSocket server is running");
});
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    const receivedMessage = message.toString();
    console.log(`Received message: ${receivedMessage}`);
    // 广播消息给所有客户端
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(receivedMessage);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// // 定时向所有客户端推送消息
// setInterval(() => {
//   const message = `Server time: ${new Date().toLocaleTimeString()}`;
//   console.log(message);
//   wss.clients.forEach((client) => {
//     if (client.readyState === client.OPEN) {
//       client.send(message);
//     }
//   });
// }, 5000); // 每5秒推送一次消息

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
