const Sequelize = require('sequelize')
const sequelize = require('../config/dbInit')

var Article = sequelize.define('article', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    post: {
        type:Sequelize.TEXT('long'),
        allowNull: false
    },
    tag:{
        type:Sequelize.STRING
    },
    createdAt: {
        type:Sequelize.NOW
    },
    updatedAt: Sequelize.BIGINT,
},{
  timestamps: false
});

module.exports = Article