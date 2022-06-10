// 使用 exports 对象，分别向外共享两个路由处理函数

// 导入数据库操作模块
const db = require("../db/index");

// 在当前项目中，使用 bcryptjs 对用户密码进行加密
const bcrypt = require("bcryptjs");
// 用这个包来生成 Token 字符串
const jwt = require("jsonwebtoken");
// 导入加密的包
const config = require("../config");

// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 接受表单数据
  const userinfo = req.body;
  if (!userinfo.username || !userinfo.password) {
    // return res.send({ status: 1, messgae: "用户或密码输入不能为空" });
    return res.cc("用户或密码输入不能为空");
  }
  const sql = "SELECT * FROM users WHERE name=?";
  db.query(sql, [userinfo.username], (err, results) => {
    if (err) {
      // return res.send({
      //   status: 1,
      //   messgae: err.message,
      // });
      return res.cc(err);
    }
    if (results.length > 0) {
      // return res.send({
      //   status: 1,
      //   message: "用户名被占用，请更换其他用户名！",
      // });
      return res.cc("用户名被占用，请更换其他用户名！");
    }
  });
  userinfo.password = bcrypt.hashSync(userinfo.password, 10);

  // 定义插入用户的SQL语句
  const sql_1 = "INSERT INTO users set ?";
  db.query(
    sql_1,
    { name: userinfo.username, password: userinfo.password },
    (err, results) => {
      if (err) {
        // return res.send({
        //   status: 1,
        //   message: err.message,
        // });
        return res.cc(err);
      }
      if (results.affectedRows !== 1) {
        // return res.send({
        //   status: 1,
        //   message: "注册用户失败，请稍后再试",
        // });
        return res.cc("注册用户失败，请稍后再试");
      }

      // res.send("注册成功");
      res.cc("注册成功", 0);
    }
  );
};

// 登录处理函数
exports.login = (req, res) => {
  // 接受表单数据
  const userinfo = req.body;
  // 定义 SQL 语句
  const sql = "SELECT * FROM users WHERE name=?";
  db.query(sql, userinfo.username, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc("登录失败");

    // 拿着用户输入的密码，和数据库中存储的密码进行对比
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    );
    if (!compareResult) {
      return res.cc("登录失败！");
    }
    // user 中只保留用户的 id、username、nickname、email
    const user = {
      ...results[0],
      password: "",
      user_pic: "",
    };
    // 生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: "10h",
    });

    res.send({
      status: 0,
      message: "登录成功！",
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: "Bearer " + tokenStr,
    });
  });
};
