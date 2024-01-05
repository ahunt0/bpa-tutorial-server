const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('StudentCourses', {
    StudentCourseID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    StudentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Students',
        key: 'StudentID'
      }
    },
    CourseID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Courses',
        key: 'CourseId'
      }
    },
    Grade: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    AssignmentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Assignments',
        key: 'AssignmentID'
      }
    }
  }, {
    sequelize,
    tableName: 'StudentCourses',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "StudentCourseID" },
        ]
      },
      {
        name: "StudentID",
        using: "BTREE",
        fields: [
          { name: "StudentID" },
        ]
      },
      {
        name: "CourseID",
        using: "BTREE",
        fields: [
          { name: "CourseID" },
        ]
      },
      {
        name: "AssignmentID",
        using: "BTREE",
        fields: [
          { name: "AssignmentID" },
        ]
      },
    ]
  });
};
