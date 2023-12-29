const Sequelize = require('sequelize');

const sequelize = new Sequelize('pixselect-backend','postgres','toprak',{
    host:'localhost',
    dialect:'postgres'
});

module.exports = sequelize;