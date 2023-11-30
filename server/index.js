const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("./config/passport");
require("dotenv").config();
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

// Routes
app.use("/api/v1/auth", authRouter);

db.sequelize.sync().then(() => {
	app.listen(3001, () => {
		console.log("Server running: http://localhost:3001");
	});
});
