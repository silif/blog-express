
var express = require('express');
var router = express.Router();

const articlesApi = require('../controllers/article');

router.get('/articles', function(req, res, err){
   const articles = articlesApi.getArticles
   console.log(articles)
   res.json({msg:articles})
});

module.exports = router