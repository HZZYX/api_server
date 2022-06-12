const db = require("../db/index");
const bcrypt = require("bcryptjs");

exports.getUserInfo = (req, res) => {
  // 定义 SQL 语句
  const sql = "SELECT Id,name,nikename,email FROM users WHERE Id=?";

  // req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
  console.log(req.user);
  db.query(sql, [req.user.Id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);
    // 执行 SQL 语句成功，但是查询到的数据条数不等于 1
    if (results.length !== 1) return res.cc("获取用户信息失败");

    res.send({
      status: 0,
      message: "获取用户信息成功",
      data: results[0],
    });
  });
};

exports.updateUserInfo = (req, res) => {
  // 定义待执行的 SQL 语句
  const sql = "UPDATE users SET ? WHERE Id=?";

  // 调用 db.query() 的执行 SQL 语句并传参
  db.query(sql, [req.body, req.body.Id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);

    // 执行 SQL 语句成功，但影响行数不为1
    if (results.affectedRows !== 1) return res.cc("修改用户基本信息失败");

    // 修改用户信息成功
    return res.cc("修改用户基本信息成功", 0);
  });
};

exports.updatePassword = (req, res) => {
  // 定义根据 id 查询用户数据的 SQL 语句
  const sql = "SELECT * FROM users WHERE Id=?";

  // 执行 SQL 语句查询用户是否存在
  db.query(sql, req.user.Id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);

    // 检查指定 id 的用户是否存在
    if (results.length !== 1) return res.cc("用户不存在");

    // 判断提交的旧密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPwd,
      results[0].password
    );
    if (!compareResult) return res.cc("原密码错误！");

    // 定义更新用户喵喵的 SQL 语句
    const sql = "UPDATE users SET password=? WHERE Id=?";

    // 对新密码进行 bcrypt 加密之后，更新到数据库中
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);

    // 执行 SQL 语句，根据 id 更新用户的密码
    db.query(sql, [newPwd, req.user.Id], (err, results) => {
      if (err) return res.cc(err);

      // SQL 语句执行成功，但影星行数不等于1
      if (results.affectedRows !== 1) return res.cc("更新密码失败");

      // 更新数据成功
      res.cc("更新密码成功", 0);
    });
  });
};

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
  console.log("有人请求了改接口",req.user);
  // 定义更新用户头像的 SQL 语句
  const sql = "UPDATE users SET user_pic=? WHERE id=?";

  // 调用 db.query() 执行 SQL 语句，更新对应用户的头像
  db.query(sql, [req.body.avatar, req.user.Id], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);
    // 执行 SQL 语句成功，但影响的行数不等于1
    if (results.affectedRows !== 1) return res.cc("更新头像失败");

    // 更新用户头像成功
    return res.cc("更新头像成功", 0);
  });
};
