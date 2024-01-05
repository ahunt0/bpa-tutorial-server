const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
	const Courses = sequelize.define(
		"Courses",
		{
			CourseId: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			CourseName: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			UserId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "Users",
					key: "UserID",
				},
				unique: "Courses_ibfk_1",
			},
			Description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			Grade: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: "Courses",
			timestamps: false,
			indexes: [
				{
					name: "PRIMARY",
					unique: true,
					using: "BTREE",
					fields: [{ name: "CourseId" }],
				},
				{
					name: "UserId",
					unique: true,
					using: "BTREE",
					fields: [{ name: "UserId" }],
				},
			],
		}
	);

	// Define association to Users model
	Courses.associate = function (models) {
		Courses.belongsTo(models.Users, {
			foreignKey: "UserId",
			as: "Teacher", // alias for the association
		});
	};

	return Courses;
};
