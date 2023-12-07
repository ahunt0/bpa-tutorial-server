const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

router.get("/users", async (req, res) => {
	try {
		const startOfDay = moment().startOf("day");
		const endOfDay = moment().endOf("day");

		const usersCountToday = await Users.count({
			where: {
				RegistrationDate: {
					[Op.gte]: startOfDay,
					[Op.lte]: endOfDay,
				},
			},
		});

		const users = await Users.findAll();

		return res.status(200).json({ users, total: users.length, usersCountToday });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server error" });
	}
});

module.exports = router;
