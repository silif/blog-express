const Sequelize = require('sequelize')
const sequelize = require('../config/dbInit')

var Tag = sequelize.define('tag', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tagname: {
        type: Sequelize.STRING
    }
    // createdAt: {
    //     type:Sequelize.NOW
    // } 
},{
  timestamps: false
});

module.exports = Tag