# 使用官方 Node.js 镜像作为基础镜像
FROM node:latest

# 设置工作目录
WORKDIR /app

# 配置 npm 使用淘宝镜像并增加超时时间
RUN npm config set registry https://registry.npmmirror.com/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

RUN npm install global nodemon
# 复制项目文件
COPY . .

# 暴露端口
EXPOSE 3000

# 启动 Node.js 应用
CMD ["npm", "start"]