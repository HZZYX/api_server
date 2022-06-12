// 导入数据库操作模块
const db = require("../db/index");

exports.getArticleCates = (req, res) => {
  // 定义 SQL 语句
  // 根据分类的状态，获取所有未被删除的分类列表数据
  // is_delete 为 0 表示没有被 标记为删除的数据

  // 排序子句语法：order by 列名 asc/desc asc升序  desc降序
  const sql = "SELECT * FROM ev_article_cate where is_delete=0 order by id asc";
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);

    // 执行 SQL 语句成功
    res.send({
      status: 0,
      message: "获取文章分类列表成功！",
      data: results,
    });
  });
};

exports.addArticleCates = (req, res) => {
  // 定义查重的 SQL 语句
  // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
  const sql = "SELECT * FROM ev_article_cate WHERE name=? OR alias=?";

  // 执行查重操作
  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    console.log(results);
    // 执行 SQL 语句失败
    if (err) return res.cc(err);

    // 判断 分类名称 和分类别名 是否被占用
    if (results.length >=2)
      return res.cc("分类名称与别名被占用，请更换后重试");

    // 分别判断 分类名 是否被占用
    if (results.length === 1 && results[0].name === req.body.name)
      return res.cc("分类名被占用，请更换后重试！");

    // 分别判断 分类别名
    if (results.length === 1 && results[0].alias === req.body.alias)
      return res.cc("分类别名被占用，请更换后重试");

    const insql = "INSERT INTO ev_article_cate set ?";
    db.query(insql, req.body, (err, results) => {
      if (err) return res.cc(err);

      // 执行 SQL 语句成功，但是影响行数不等于 1
      if (results.affectedRows !== 1) return res.cc("新增文章分类失败");

      // 新增文章分类成功
      res.cc("新增文章分类成功", 0);
    });
  });
};

exports.deleteCateById = (req, res) => {
  // 定义删除文章的分类的SQL语句
  const sql = "UPDATE ev_article_cate set is_delete=1 WHERE Id=?";
  db.query(sql, req.params.id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);

    // SQL 语句执行成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc("删除文章分类失败");

    // 删除文章分类成功
    res.cc("删除文章分类成功", 0);
  });
};

exports.getArticleById = (req, res) => {
  // 定义根据 ID 获取文章分类的SQL语句
  const sql = "SELECT * FROM ev_article_cate where id=?";
  db.query(sql, req.params.id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);

    // SQL语句执行成功，但是没有查询到任何数据
    if (results.length !== 1) return res.cc("获取文章分类数据失败");

    // 把数据响应给客户端
    res.send({
      status: 0,
      message: "获取文章分类数据成功",
      data: results[0],
    });
  });
};

// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
  // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
  const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`;
  // 执行查重操作
  db.query(
    sql,
    [req.body.Id, req.body.name, req.body.alias],
    (err, results) => {
      if (err) return res.cc(err);

      // 判断 分类名称 和 分类别名 是否被占用
      if (results.length === 2)
        return res.cc("分类名称与别名被占用，请更换后重试");

      // 分别判断 分类名 是否被占用
      if (results.length === 1 && results[0].name === req.body.name)
        return res.cc("分类名被占用，请更换重试");

      // 分别判断 分类别名 是否被占用
      if (results.length === 1 && results[0].alias === req.body.alias)
        return res.cc("分类别名被占用，请跟更换后重试");

      const xsql = "UPDATE ev_article_cate set ? where Id=?";
      db.query(xsql, [req.body, req.body.Id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err + "报错哦");

        // SQL 语句执行成功，但是影响行数不等于1
        if (results.affectedRows !== 1) return res.cc("更新文章分类失败哦");

        // 更新文章分类成功
        res.cc("更新文章分类成功", 0);
      });
    }
  );
};
