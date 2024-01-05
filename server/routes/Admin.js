const express = require("express");
const router = express.Router();
const { Users, Courses, Assignments } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

router.get("/users", async (req, res) => {
	try {
		const users = await Users.findAll({ attributes: ["UserID", "FirstName", "LastName", "Email", "Access", "RegistrationDate"] });
		return res.status(200).json({ success: true, users });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
});

router.get("/user/:id", async (req, res) => {
	try {
		const user = await Users.findOne({ where: { UserID: req.params.id }, attributes: ["UserID", "FirstName", "LastName", "Email", "Access", "RegistrationDate"] });
		if (!user) {
			return res.status(404).json({ success: false, error: "User not found" });
		}
		return res.status(200).json({ success: true, user });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
});

router.get("/users/total", async (req, res) => {
	try {
		const total = await Users.count();
		return res.status(200).json({ success: true, total });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
});

router.get("/users/today", async (req, res) => {
	try {
		const startOfDay = moment().startOf("day");
		const endOfDay = moment().endOf("day");
		const usersCountToday = await Users.count({ where: { RegistrationDate: { [Op.gte]: startOfDay, [Op.lte]: endOfDay } } });
		return res.status(200).json({ success: true, usersCountToday });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
});

router.get("/users/find/:name?", async (req, res) => {
	try {
		let users;
		const { name } = req.params;
		const role = req.query.role || "";

		// Define role conditions based on the provided role parameter
		const roleConditions = role === "student" ? { Access: "student" } : role === "teacher" ? { Access: "teacher" } : role === "admin" ? { Access: "admin" } : {};

		// Check if name exists to include it in the query
		const nameConditions = name
			? {
					[Op.or]: [{ FirstName: { [Op.like]: `%${name}%` } }, { LastName: { [Op.like]: `%${name}%` } }, { Email: { [Op.like]: `%${name}%` } }],
			  }
			: {};

		// Construct the query with additional role and name conditions
		users = await Users.findAll({
			where: {
				[Op.and]: [
					nameConditions, // Apply name-specific conditions if name exists
					roleConditions, // Apply role-specific conditions
				],
			},
			attributes: ["UserID", "FirstName", "LastName", "Email", "Access", "RegistrationDate"],
		});

		if (users.length === 0) {
			return res.status(404).json({ success: false, error: "No users found" });
		}

		return res.status(200).json({ success: true, users });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
});

router.put("/user/edit/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { FirstName, LastName, Email, Access } = req.body;

		// Check if the user exists
		const user = await Users.findOne({ where: { UserID: id } });
		if (!user) {
			return res.status(404).json({ success: false, error: "User not found" });
		}

		// Update the user details
		await Users.update(
			{ FirstName, LastName, Email, Access },
			{
				where: { UserID: id },
			}
		);

		return res.status(200).json({ success: true, message: "User updated successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
});

router.delete("/user/delete/:id", async (req, res) => {
	try {
		const { id } = req.params;

		// Check if the user exists
		const user = await Users.findOne({ where: { UserID: id } });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Delete the user
		await Users.destroy({ where: { UserID: id } });

		return res.status(200).json({ success: true, message: "User deleted successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
});

// Courses

router.get("/courses", async (req, res) => {
	try {
		const courses = await Courses.findAll({
			attributes: ["CourseId", "CourseName", "UserId", "Description", "Grade"],
			include: [{ model: Users, as: "Teacher", attributes: ["UserID", "FirstName", "LastName", "Email"] }],
		});
		return res.status(200).json({ success: true, courses });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
});

router.get("/course/:id", async (req, res) => {
	try {
		const course = await Courses.findOne({
			where: { CourseID: req.params.id },
			attributes: ["CourseId", "CourseName", "UserId", "Description", "Grade"],
			include: [{ model: Users, as: "Teacher", attributes: ["UserID", "FirstName", "LastName"] }],
		});
		if (!course) {
			return res.status(404).json({ success: false, error: "Course not found" });
		}
		return res.status(200).json({ success: true, course });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
});

router.get("/courses/find/:name?", async (req, res) => {
	try {
		let courses;
		const { name } = req.params;
		const grade = req.query.grade || "";

		// Define grade conditions based on the provided grade parameter
		const gradeConditions = grade ? { Grade: grade.replace(/(\d+)(st|nd|rd|th)/g, "$1") } : {};

		// Check if name exists to include it in the query
		const courseNameConditions = name ? { CourseName: { [Op.like]: `%${name}%` } } : {};

		// Construct the query with additional role and name conditions
		courses = await Courses.findAll({
			where: {
				[Op.and]: [
					courseNameConditions, // Apply name-specific conditions if name exists
					gradeConditions, // Apply grade-specific conditions
				],
			},
			attributes: ["CourseId", "CourseName", "UserId", "Description", "Grade"],
			include: [{ model: Users, as: "Teacher", attributes: ["UserID", "FirstName", "LastName", "Email"] }],
		});

		if (courses.length === 0) {
			return res.status(404).json({ success: false, error: "No courses found" });
		}

		return res.status(200).json({ success: true, courses });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
});

// Create a new course

router.post("/courses/create", async (req, res) => {
	try {
		const { CourseName, UserId, Description, Grade } = req.body;

		// Check if the course exists
		const course = await Courses.findOne({ where: { CourseName: CourseName } });
		if (course) {
			return res.status(404).json({ success: false, error: "Course already exists" });
		}

		// Create a new course
		try {
			const newCourse = await Courses.create({
				CourseName,
				UserId,
				Description,
				Grade,
			});
		} catch (error) {
			if (error.name === "SequelizeUniqueConstraintError") {
				return res.status(400).json({ success: false, error: { message: "Teacher already has a course", code: 1 } });
			}
			throw error;
		}

		return res.status(200).json({ success: true, message: "Course created successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
});

// Edit a course

router.put("/course/edit/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { CourseName, UserId, Description, Grade } = req.body;

		// Check if the course exists
		const course = await Courses.findOne({ where: { CourseID: id } });
		if (!course) {
			return res.status(404).json({ success: false, error: "Course not found" });
		}

		// Update the course details
		try {
			await Courses.update(
				{ CourseName, UserId, Description, Grade },
				{
					where: { CourseID: id },
				}
			);
		} catch (error) {
			if (error.name === "SequelizeUniqueConstraintError") {
				return res.status(400).json({ success: false, error: { message: "Teacher already has a course", code: 1 } });
			}
			throw error;
		}

		return res.status(200).json({ success: true, message: "Course updated successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
});

// Delete a course

router.delete("/course/delete/:id", async (req, res) => {
	try {
		const { id } = req.params;

		// Check if the course exists
		const course = await Courses.findOne({ where: { CourseID: id } });
		if (!course) {
			return res.status(404).json({ error: "Course not found" });
		}

		// Delete the course
		await Courses.destroy({ where: { CourseID: id } });

		return res.status(200).json({ success: true, message: "Course deleted successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
});

// Assignments routes

router.get("/assignments/:courseId", async (req, res) => {
	// Find all assignments for the provided course ID and search for the course name if it exists
	const assignments = await Assignments.findAll({
		where: { CourseID: req.params.courseId },
		attributes: ["AssignmentID", "AssignmentName", "AssignmentGrade", "Deadline", "Description", "TeacherID", "Content", "ContentType"],
		include: [
			{ model: Courses, as: "Course", attributes: ["CourseId", "CourseName"] },
			{ model: Users, as: "Teacher", attributes: ["UserID", "FirstName", "LastName"] },
		],
	});

	if (assignments.length === 0) {
		return res.status(404).json({ success: false, error: "No assignments found" });
	}

	return res.status(200).json({ success: true, assignments });
});

router.get("/assignment/:id", async (req, res) => {
	try {
		const assignment = await Assignments.findOne({
			where: { AssignmentID: req.params.id },
			attributes: ["AssignmentID", "AssignmentName", "AssignmentGrade", "Deadline", "Description", "TeacherID", "Content", "ContentType"],
			include: [
				{ model: Courses, as: "Course", attributes: ["CourseId", "CourseName"] },
				{ model: Users, as: "Teacher", attributes: ["UserID", "FirstName", "LastName"] },
			],
		});
		if (!assignment) {
			return res.status(404).json({ success: false, error: "Assignment not found" });
		}
		return res.status(200).json({ success: true, assignment });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
});

router.get("/assignments/find/:name?", async (req, res) => {
	try {
		let assignments;
		const { name } = req.params;

		// Check if name exists to include it in the query
		const assignmentNameConditions = name ? { AssignmentName: { [Op.like]: `%${name}%` } } : {};

		// Construct the query with additional role and name conditions
		assignments = await Assignments.findAll({
			where: {
				[Op.and]: [
					assignmentNameConditions, // Apply name-specific conditions if name exists
				],
			},
			attributes: ["AssignmentID", "AssignmentName", "AssignmentGrade", "Deadline", "Description", "TeacherID", "Content"],
			include: [
				{ model: Courses, as: "Course", attributes: ["CourseId", "CourseName"] },
				{ model: Users, as: "Teacher", attributes: ["UserID", "FirstName", "LastName"] },
			],
		});

		if (assignments.length === 0) {
			return res.status(404).json({ success: false, error: "No assignments found" });
		}

		return res.status(200).json({ success: true, assignments });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
});

// Create a new assignment

router.post("/assignments/create", async (req, res) => {
	try {
		const { CourseId, AssignmentName, AssignmentGrade, Deadline, Description, TeacherID, Content, ContentType } = req.body;

		// Check if the assignment exists
		const assignment = await Assignments.findOne({ where: { AssignmentName: AssignmentName } });
		if (assignment) {
			return res.status(404).json({ success: false, error: "Assignment already exists" });
		}

		// Create a new assignment
		try {
			const newAssignment = await Assignments.create({
				CourseId,
				AssignmentName,
				AssignmentGrade,
				Deadline,
				Description,
				TeacherID,
				Content,
				ContentType,
			});
		} catch (error) {
			throw error;
		}

		return res.status(200).json({ success: true, message: "Assignment created successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
});

module.exports = router;
