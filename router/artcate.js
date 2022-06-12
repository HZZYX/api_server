// 导入 express
const express = require("express");
// 创建路由对象
const router = express.Router();

// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入文章分类发验证模块
const {
  add_cate_schema,
  delete_cate_schema,
  get_cate_schema,
  update_cate_schema,
} = require("../schema/artcate");

// 导入文章分类的路由处理函数模块
const artcate_handler = require("../router_handler/artcate");

// 获取文章分类的列表数据
router.get("/cates", artcate_handler.getArticleCates);

// 新增文章分类的路由
router.post(
  "/addcates",
  expressJoi(add_cate_schema),
  artcate_handler.addArticleCates
);

// 删除文章分类的路由
router.get(
  "/delete/:id",
  expressJoi(delete_cate_schema),
  artcate_handler.deleteCateById
);

// 根据 ID 获取文章分类数据
router.get(
  "/cates/:id",
  expressJoi(get_cate_schema),
  artcate_handler.getArticleById
);

// 根据 ID 更新文章分类数据
router.post(
  "/updatecate",
  expressJoi(update_cate_schema),
  artcate_handler.updateCateById
);

// 向外共享路由对象
module.exports = router;
