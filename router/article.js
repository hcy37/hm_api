// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章的验证模块
const { add_article_schema } = require('../schema/article')
// 导入文章的路由处理函数模块
const article_handler = require('../router_handler/article')
// 发布新文章
// 向外共享路由对象
// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
const multer = require('multer')
const path = require('path')
const upload = multer({ dest: path.join(__dirname, '../uploads') })
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema),article_handler.addArticle)

module.exports = router