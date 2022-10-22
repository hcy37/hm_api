// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
const upload = multer({ dest: path.join(__dirname, '../uploads') })
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    // 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
    // TODO：表单数据合法，继续后面的处理流程...
    // 导入处理路径的 path 核心模块
    const path = require('path')
    const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.user.id,
    }
    const sql = `insert into ev_articles set ?`
    // 导入数据库操作模块
    const db = require('../db/index')
    // 执行 SQL 语句
    db.query(sql, articleInfo, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('发布文章失败！')
        // 发布文章成功
    res.cc('发布文章成功', 0)
    })

    }
exports.listArticle = async (req, res) => {
        const sql = `select a.id, a.title, a.pub_date, a.state, b.name as cate_name
                    from en_articles as a,en_article_cate as b 
                    where a.cate_id = b.id and a.cate_id = ifnull(?, a.cate_id)  and a.state = ifnull(?, a.state) and a.is_delete = 0  limit ?,?`
    
        let results = []
        try {
            results = await db.queryByPromisify(sql, [req.query.cate_id || null, req.query.state || null, (req.query.pagenum - 1) * req.query.pagesize, req.query.pagesize])
        } catch (e) {
            return res.cc(e)
        }
    
        // bugfix: 之前这里没有添加过滤条件 state和cate_id，导致 文章列表的分页pageBox中查询总数不正确
        const countSql = 'select count(*) as num from en_articles where is_delete = 0 and state = ifnull(?,state) and cate_id = ifnull(?,cate_id)'
        let total = null
        try {
            let [{ num }] = await db.queryByPromisify(countSql, [req.query.state || null, req.query.cate_id || null])
            total = num
        } catch (e) {
            return res.cc(e)
        }
    
        res.send({
            status: 0,
            msg: '获取文章列表成功',
            data: results,
            total
        })
    
    }