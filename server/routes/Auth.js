const express = require("express");
const router = express.Router();
const { hashPassword, comparePassword } = require("../util/helpers");
const { Op } = require("sequelize");
const { Users } = require("../models");

router.post("/register", async (req, res) => {
	let { Username, Email, Password, FirstName, LastName } = req.body;

	try {
		// Force email and username to lowercase
		Username = Username.toLowerCase();
		Email = Email.toLowerCase();

		// Check if username or email already exists
		const existingUser = await Users.findOne({
			where: {
				[Op.or]: [{ Username: Username }, { Email: Email }],
			},
		});

		if (existingUser) {
			return res.status(400).json({ message: "Username or email already taken" });
		}

		// Create new user
		const newUser = await Users.create({
			Username,
			Email,
			Password: hashPassword(Password),
			FirstName,
			LastName,
		});

		return res.status(201).json({ message: "User created", user: newUser });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
});

router.post("/login", (req, res) => {
	res.send("Login route");
});

module.exports = router;
