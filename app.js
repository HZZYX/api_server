// 导入 express 模块
const express = require("express");
// 创建 express 的服务实例
const app = express();
// 当前开启的服务器端口号
const port = 3000;

// 导入配置文件
const config = require("./config");
// 解析 token 的中间件
const expressJWT = require("express-jwt");

app.use(function (req, res, next) {
  // status = 0 为成功；
  // status =  1 为失败；
  // 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = function (err, status = 1) {
    res.send({
      // 状态
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 使用 .unless({path:[/^\/api\//]}) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }));

// 错误中间件
const joi = require("joi");

// 导入 cors 中间件
const cors = require("cors");
// 将 cors 注册为全局中间件
app.use(cors());

// 配置解析 application/x-www-form-urlencoded格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }));

// 配置解析 json 格式数据的中间件
app.use(express.json());




// 导入并注册用户路由模块
const usrRouter = require("./router/user");
app.use("/api", usrRouter);

// 导入用户个人信息路由模块
const userInfoRouter = require("./router/userinfo");
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token身份认证
app.use("/my", userInfoRouter);

// 错误中间件
app.use(function (err, req, res, next) {
  if (err.name == "UnauthorizedError") return res.cc("身份认证失败！");
   // 局部中间件
  if (err instanceof joi.ValidationError) return res.cc(err);
  // 未知错误
  res.cc(err);
});

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(port, () =>
  console.log(`Server running at  http://127.0.0.1:${port}`)
);
