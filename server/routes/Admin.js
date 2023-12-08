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

// router.get("/users/:id", async (req, res) => {
// 	try {
// 		const user = await Users.findOne({ where: { UserID: req.params.id }, attributes: ["UserID", "FirstName", "LastName", "Email", "Access", "RegistrationDate"] });
// 		return res.status(200).json({ user });
// 	} catch (error) {
// 		console.error(error);
// 		return res.status(500).json({ message: "Internal server error" });
// 	}
// });

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

module.exports = router;
