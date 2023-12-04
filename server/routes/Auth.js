const express = require("express");
const router = express.Router();
const { hashPassword, comparePassword } = require("../util/helpers");
const { Op } = require("sequelize");
const { Users } = require("../models");
const passport = require("../config/passport");

router.post("/register", async (req, res) => {
	console.log(req.body);
	let { email, password, firstName, lastName } = req.body;

	try {
		// Force email to lowercase
		email = email.toLowerCase();

		// Check if email already exists
		const existingUser = await Users.findOne({
			where: {
				[Op.or]: [{ Email: email }],
			},
		});

		if (existingUser) {
			return res.status(400).json({ message: "Email is already in use" });
		}

		// Create new user
		const newUser = await Users.create({
			Email: email,
			Password: hashPassword(password),
			FirstName: firstName,
			LastName: lastName,
		});

		return res.status(201).json({ message: "User created", user: newUser });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
});

router.post("/login", function (req, res, next) {
	passport.authenticate("local", function (err, user, info) {
		if (err) {
			console.error(err);
			return next(err);
		}
		if (!user) {
			return res.status(401).json({ message: "Authentication failed", info: info });
		}
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			return res.status(200).json({ message: "Logged in" });
		});
	})(req, res, next);
});

router.get("/isAuthenticated", (req, res) => {
	try {
		if (req.user) {
			return res.status(200).json({ message: "Authenticated", access: req.user.Access });
		} else {
			return res.status(401).json({ message: "Not Authenticated" });
		}
	} catch (error) {
		console.error("Error checking authentication:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
});

module.exports = router;
