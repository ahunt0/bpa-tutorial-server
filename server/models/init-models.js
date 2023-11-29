var DataTypes = require("sequelize").DataTypes;
var _Students = require("./Students");
var _Teachers = require("./Teachers");
var _Users = require("./Users");

function initModels(sequelize) {
  var Students = _Students(sequelize, DataTypes);
  var Teachers = _Teachers(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  Students.belongsTo(Users, { as: "User", foreignKey: "UserID"});
  Users.hasOne(Students, { as: "Student", foreignKey: "UserID"});
  Teachers.belongsTo(Users, { as: "User", foreignKey: "UserID"});
  Users.hasOne(Teachers, { as: "Teacher", foreignKey: "UserID"});

  return {
    Students,
    Teachers,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
