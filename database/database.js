const Sequelize = require("sequelize");

const connection = new Sequelize("blog", "gsoft_MySql", "Ms@402507", {
  host: "128.201.72.240",
  dialect: "mysql",
  timezone: "-03:00",
});

module.exports = connection;
