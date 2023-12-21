const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

router.get("/users", async (req, res) => {
	try {
		const users = await Users.findAll({ attributes: ["UserID", "FirstName", "LastName", "Email", "Access", "RegistrationDate"] });
		return res.status(200).json({ users });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/user/:id", async (req, res) => {
	try {
		const user = await Users.findOne({ where: { UserID: req.params.id }, attributes: ["UserID", "FirstName", "LastName", "Email", "Access", "RegistrationDate"] });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		return res.status(200).json({ user });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/users/total", async (req, res) => {
	try {
		const total = await Users.count();
		return res.status(200).json({ total });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/users/today", async (req, res) => {
	try {
		const startOfDay = moment().startOf("day");
		const endOfDay = moment().endOf("day");
		const usersCountToday = await Users.count({ where: { RegistrationDate: { [Op.gte]: startOfDay, [Op.lte]: endOfDay } } });
		return res.status(200).json({ usersCountToday });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server error" });
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
			return res.status(404).json({ error: "No users found" });
		}

		return res.status(200).json({ users });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server error" });
	}
});

router.put("/user/edit/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { FirstName, LastName, Email, Access } = req.body;

		// Check if the user exists
		const user = await Users.findOne({ where: { UserID: id } });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Update the user details
		await Users.update(
			{ FirstName, LastName, Email, Access },
			{
				where: { UserID: id },
			}
		);

		return res.status(200).json({ message: "User updated successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
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

		return res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
