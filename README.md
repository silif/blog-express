# blog 系统后台
此项目是 express.js 搭建的博客后台系统，数据库是 mysql;支持文章按id查询、文章按标查询、文章上传、文章归档查询
### 使用
先按照配置建好数据库、再按照model建立好表、启动数据库服务
```git 
clone git@github.com:silif/blog-express.git
```
```
cd blog-express
```
```
npm run install
```
```
npm run start
```

### 其他
- [sequelizejs](https://github.com/sequelize/sequelize) 数据库操作的 orm 库，简化数据库操作
- [multer](https://github.com/expressjs/multer) express上传 formdata 的中间件
- [showdown](https://github.com/showdownjs/showdown) 把 markdown 转换成 html 文档的库
- [nodemon](https://github.com/remy/nodemon) 监控 express 代码变动并自动重启服务器
### todo
- 图片上传
- 上传验证