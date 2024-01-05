const express = require("express");
const router = express.Router();

router.get("/current-user", (req, res) => {
	if (req.user) {
		res.json({ success: true, user: { id: req.user.UserID, email: req.user.Email, firstName: req.user.FirstName, lastName: req.user.LastName, access: req.user.Access } });
	} else {
		res.status(401).json({ success: false, error: "No user is currently logged in" });
	}
});

module.exports = router;
