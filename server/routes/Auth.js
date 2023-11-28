const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
	const user = req.body;
});

router.post("/login", (req, res) => {
	res.send("Login route");
});

module.exports = router;
