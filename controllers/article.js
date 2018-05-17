const Article = require('../models/article');

console.log('Aticle',Article)
const getArticles = Article.findAll().then(articles => {
    console.log("articles",articles)
    return articles
})

module.exports = {
    getArticles
}