const db = require("../db/index");
const path = require("path");

exports.addArticle = (req, res) => {
  console.log("有人访问了改接口");
  console.log(req.file);
  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== "cover_img")
    return res.cc("文章封面是必选参数！");

  const articleInfo = {
    // 标题、内容、状态、所属的分类ID
    cover_img: path.join("/uploads", req.file.fieldname),
    // 文章发布时间
    pub_date: new Date(),
    ...req.body,
    // 文章作者的Id
    author_id: req.user.id,
  };

  // 定义发布文章的SQL语句
  const sql = `insert into articles set ?`;
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err);
    // 执行SQL语句成功，但是影响行数不等于1
    if (results.affectedRows !== 1) return res.cc("发布文章失败");
    // 发布文章成功
    res.cc("发布文章成功", 0);
  });
};
