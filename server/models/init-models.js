var DataTypes = require("sequelize").DataTypes;
var _Assignments = require("./Assignments");
var _Courses = require("./Courses");
var _StudentCourses = require("./StudentCourses");
var _Students = require("./Students");
var _Teachers = require("./Teachers");
var _Users = require("./Users");

function initModels(sequelize) {
  var Assignments = _Assignments(sequelize, DataTypes);
  var Courses = _Courses(sequelize, DataTypes);
  var StudentCourses = _StudentCourses(sequelize, DataTypes);
  var Students = _Students(sequelize, DataTypes);
  var Teachers = _Teachers(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  StudentCourses.belongsTo(Assignments, { as: "Assignment", foreignKey: "AssignmentID"});
  Assignments.hasMany(StudentCourses, { as: "StudentCourses", foreignKey: "AssignmentID"});
  Assignments.belongsTo(Courses, { as: "Course", foreignKey: "CourseID"});
  Courses.hasMany(Assignments, { as: "Assignments", foreignKey: "CourseID"});
  StudentCourses.belongsTo(Courses, { as: "Course", foreignKey: "CourseID"});
  Courses.hasMany(StudentCourses, { as: "StudentCourses", foreignKey: "CourseID"});
  StudentCourses.belongsTo(Students, { as: "Student", foreignKey: "StudentID"});
  Students.hasMany(StudentCourses, { as: "StudentCourses", foreignKey: "StudentID"});
  Assignments.belongsTo(Teachers, { as: "Teacher", foreignKey: "TeacherID"});
  Teachers.hasMany(Assignments, { as: "Assignments", foreignKey: "TeacherID"});
  Courses.belongsTo(Users, { as: "User", foreignKey: "UserId"});
  Users.hasOne(Courses, { as: "Course", foreignKey: "UserId"});
  Students.belongsTo(Users, { as: "User", foreignKey: "UserID"});
  Users.hasOne(Students, { as: "Student", foreignKey: "UserID"});
  Teachers.belongsTo(Users, { as: "User", foreignKey: "UserID"});
  Users.hasOne(Teachers, { as: "Teacher", foreignKey: "UserID"});

  return {
    Assignments,
    Courses,
    StudentCourses,
    Students,
    Teachers,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
