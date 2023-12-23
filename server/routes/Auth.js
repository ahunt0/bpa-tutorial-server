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

		// Validations
		if (!email) {
			return res.status(400).json({ message: "Email is required" });
		}

		if (!password) {
			return res.status(400).json({ message: "Password is required" });
		}

		if (!firstName) {
			return res.status(400).json({ message: "First name is required" });
		}

		if (!lastName) {
			return res.status(400).json({ message: "Last name is required" });
		}

		// Check email based on regex
		const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ success: false, message: "Email is invalid" });
		}

		// Check if email already exists
		const existingUser = await Users.findOne({
			where: {
				[Op.or]: [{ Email: email }],
			},
		});

		if (existingUser) {
			return res.status(400).json({ success: false, message: "Email is already in use" });
		}

		// Create new user
		const newUser = await Users.create({
			Email: email,
			Password: hashPassword(password),
			FirstName: firstName,
			LastName: lastName,
		});

		return res.status(201).json({ success: true, message: "User created", user: newUser });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
});

router.post("/login", function (req, res, next) {
	// Validate email and password
	if (!req.body.email) {
		return res.status(400).json({ success: false, message: "Email is required" });
	}

	if (!req.body.password) {
		return res.status(400).json({ success: false, message: "Password is required" });
	}

	passport.authenticate("local", function (err, user, info) {
		if (err) {
			console.error(err);
			return next(err);
		}
		if (!user) {
			return res.status(401).json({ success: false, message: "Incorrect email or password", info: info });
		}
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			return res.status(200).json({ success: true, message: "Logged in" });
		});
	})(req, res, next);
});

router.get("/isAuthenticated", (req, res) => {
	try {
		if (req.user) {
			return res.status(200).json({ auth: true, access: req.user.Access });
		} else {
			return res.status(401).json({ auth: false });
		}
	} catch (error) {
		console.error("Error checking authentication:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
});

module.exports = router;
