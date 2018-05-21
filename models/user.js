const Sequelize = require('sequelize')
const sequelize = require('../config/dbInit')

var User = sequelize.define('user', {
    uid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
},{
  timestamps: false
});

module.exports = User