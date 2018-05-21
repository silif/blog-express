
var express = require('express');
var router = express.Router();
var multer = require('multer');
const Article = require('../models/article');
const Tag = require('../models/tag');
// md to html
var showdown  = require('showdown');
var converter = new showdown.Converter();
// 文件上传设置
const disksStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'articles')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
var uploadToDisk = multer({ storage: disksStorage })
const bufferStorage = multer.memoryStorage()
var uploadToBuffer = multer({ storage: bufferStorage })
router.get('/tags', function(req, res, next){
    Tag.findAll().then(function(tags) {
        console.log(tags)
        res.json({
            result:'success',
            data:tags
        })
    })
    .catch(err => {
        res.json({
            result:'fail'
        })
    })
})
router.get('/latest', function(req, res, next){
    Article.findAll({
        attributes: ['id','title','tagname','createdAt','updatedAt'],
        order: [
            ['createdAt', 'DESC']
        ],
        limit: 6
    }).then(function(posts){
        res.json({
            result:"success",
            data:posts
        })
    }).catch(function(err){
        console.log('err',err)
        res.json({
            result:"fail"
        })
    })
});
router.get('/allposts', function(req, res, next){
    Article.findAll({
        attributes: ['id','title','tagname','createdAt','updatedAt'],
        order: [
            ['createdAt', 'DESC']
        ],
    }).then(function(posts){
        res.json({
            result:"success",
            data:posts
        })
    }).catch(function(err){
        console.log('err',err)
        res.json({
            result:"fail"
        })
    })
});
router.get('/postsByTagname/:tagname', function(req, res, next){
    const tagname = req.params.tagname
    Article.findAll({
        where: {tagname:tagname},
        attributes: ['id','title','tagname','createdAt','updatedAt'],
        order: [
            ['createdAt', 'DESC']
        ],
    }).then(function(posts){
        res.json({
            result:"success",
            data:posts
        })
    }).catch(function(err){
        console.log('err',err)
        res.json({
            result:"fail"
        })
    })
})
router.get('/posts/:postId', function(req, res, next){
    const id = req.params.postId
    Article.findAll({
        attributes: ['title','tagname','post','createdAt','updatedAt'],
        where: {
            id: id
        }
    }).then(function(article){
        res.json({
            result:"success",
            data:article[0]
        })
    }).catch(function(err){
        console.log('err',err)
        res.json({
            result:"fail"
        })
    })
});
const fields = [{
    name:"title"
},{
    name:"post"
},{
    name:"tag"
}]
// 保存文章到磁盘（可选）
router.post('/articlesToDisk',uploadToDisk.fields(fields), function(req, res, next){
    // let formData = req.body;
    let post = req.files.post
    console.log('post', post);
    res.json({result:"success"});
});
router.post('/articlesToHtml',uploadToBuffer.fields(fields), function(req, res, next){
    let params = req.body;
    let myPost = req.files.post;
    if(!myPost){
        res.json({
            result:"fail"
        })
        return
    }
    let postBuffer = req.files.post[0].buffer
    let postString = postBuffer.toString('utf8')
    let postHtml = converter.makeHtml(postString);
    const article = {
        title:params.title,
        tagname:params.tagname.toUpperCase(),
        post:postHtml
    }
    const tag = {
        tagname:params.tagname.toUpperCase()
    }
    const insertArticlePromise =  Article.create(article)
    const insertTagPromise =  Tag.findOrCreate({where: tag})
    Promise.all([insertArticlePromise,insertTagPromise]).then(function(data){
        console.log(tag)
        res.json({
            result:"success",
            data:data
        })
    }).catch(err=>{
        console.log(err)
        res.json({
            result:"fail"
        })
    })
});
module.exports = router