const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("./config/passport");
require("dotenv").config();
const cors = require("cors");
const config = require("./config/config");

// Route imports
const authRouter = require("./routes/Auth");

const db = require("./models");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

// Routes
app.use("/api/v1/auth", authRouter);

// Error handler
app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).json({ message: "Internal Server Error" });
});

db.sequelize.sync().then(() => {
	app.listen(3001, () => {
		console.log("Server running: http://localhost:3001");
	});
});
