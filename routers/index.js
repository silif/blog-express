
var express = require('express');
var router = express.Router();
var multer = require('multer');
const Article = require('../models/article');
const Tag = require('../models/tag');
const User = require('../models/user');
// md to html
var showdown  = require('showdown');
var converter = new showdown.Converter();
// 文件上传设置
function getTime(){
    const today = new Date();
    const newTime = today.getFullYear() +'' + (today.getMonth() +1) +'' + today.getDate() + '' + today.getHours()
    return newTime
}

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'articles/images')
    },
    filename: function (req, file, cb) {
        cb(null, getTime() + '-' + file.originalname)
    }
})
var uploadToDisk = multer({storage: diskStorage})

const bufferStorage = multer.memoryStorage()
var uploadToHtml = multer({storage: bufferStorage})

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
},{
    name:"images"
}]

function userValidate (req, res, next) {
    // 向user数据库验证用户名和密码，通过则继续，否则返回wrong
    const reqbody = req.body;
    console.log(reqbody)
    // 这里为何body总是为{}？？？
    const username = req.params.username,
    password = req.params.password
    User.findAll().then(data => {
        if(data[0]['dataValues']['username'] === username && data[0]['dataValues']['password'] === password){
            next()
        }else{
            res.json({
                result:'wrong'
            })
            return false
        }
    })
}
// 将文章和图片保存到磁盘
router.post('/articlesToDisk/:username/:password', userValidate, uploadToDisk.fields(fields), function(req, res, next){
    console.log("files",req.files)
    res.json({result:"success"});
});
router.post('/articlesToHtml/:username/:password', userValidate, uploadToHtml.fields(fields), function(req, res, next){
    let bodydataa = req.body;
    let myPost = req.files.post;
    let title = bodydataa.title;
    let tagname = bodydataa.tagname;
    
    if(!myPost || !tagname || !title){
        res.json({
            result:"lostparams"
        })
        return
    }
    let postBuffer = req.files.post[0].buffer
    let postString = postBuffer.toString('utf8')
    let postHtml = converter.makeHtml(postString);
    const article = {
        title:title,
        tagname:tagname,
        post:postHtml
    }
    const tag = {
        tagname:tagname
    }
    const insertArticlePromise =  Article.create(article)
    const insertTagPromise =  Tag.findOrCreate({where: tag})
    Promise.all([insertArticlePromise,insertTagPromise]).then(function(data){
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