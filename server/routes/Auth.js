const express = require("express");
const router = express.Router();
const { hashPassword, comparePassword } = require("../util/helpers");
const User = require("../models").Users;

router.post("/register", async (req, res) => {
	console.log(req.body);
	const { Username, Email, Password, FirstName, LastName } = req.body;

	// Check if username or email already exists
	const user = await User.findOne({ $or: [{ Username: Username }, { Email: Email }] });
	if (user) {
		return res.status(400).json({ message: "Username or email already taken" });
	} else {
		// Create new user
		const newUser = new User({
			Username,
			Email,
			Password: hashPassword(Password),
			FirstName,
			LastName,
		});
		await newUser.save();
		return res.status(201).json({ message: "User created" });
	}
});

router.post("/login", (req, res) => {
	res.send("Login route");
});

module.exports = router;
