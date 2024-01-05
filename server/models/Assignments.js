const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
	const Assignments = sequelize.define(
		"Assignments",
		{
			AssignmentId: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			CourseId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "Courses",
					key: "CourseId",
				},
			},
			AssignmentName: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			AssignmentGrade: {
				type: DataTypes.DECIMAL(5, 2),
				allowNull: true,
			},
			Deadline: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			Description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			TeacherID: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "Users",
					key: "UserID",
				},
			},
			Content: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			ContentType: {
				type: DataTypes.ENUM("video", "text", "link"),
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: "Assignments",
			timestamps: false,
			indexes: [
				{
					name: "PRIMARY",
					unique: true,
					using: "BTREE",
					fields: [{ name: "AssignmentID" }],
				},
				{
					name: "CourseID",
					using: "BTREE",
					fields: [{ name: "CourseID" }],
				},
				{
					name: "TeacherID",
					using: "BTREE",
					fields: [{ name: "TeacherID" }],
				},
			],
		}
	);

	Assignments.associate = function (models) {
		Assignments.belongsTo(models.Courses, { foreignKey: "CourseID" });
		Assignments.belongsTo(models.Users, {
			foreignKey: "TeacherID",
			as: "Teacher",
		});
	};

	return Assignments;
};
