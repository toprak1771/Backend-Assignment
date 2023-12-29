const Sequelize = require("sequelize");
const sequelize = require("../utils/db");

const UserProject = sequelize.define("user-project", {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
});

module.exports = UserProject;