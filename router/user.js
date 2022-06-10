const express = require("express");
const router = express.Router();
// 1. 导入验证表单数据的中间件
const expressJoi = require("@escook/express-joi");
// 2. 导入需要的验证规则对象
const { reg_login_schema } = require("../schema/user");

// 导入用户路由处理函数模块
const { regUser, login } = require("../router_handler/user");

router.post("/login", expressJoi(reg_login_schema), login);

router.post("/reguser", expressJoi(reg_login_schema), regUser);

module.exports = router;
