const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("./config/passport");
require("dotenv").config();
const cors = require("cors");
const config = require("./config/config");

// Route imports
const authRouter = require("./routes/Auth");
const adminRouter = require("./routes/Admin");

const db = require("./models");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS options
const corsOptions = {
	origin: "http://localhost:3000", // Adjust to match your client-side URL without "/login"
	credentials: true, // Allow credentials (cookies) in cross-origin requests
};
app.use(cors(corsOptions));

// Configure session options
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false, // Set to true if using HTTPS
			maxAge: 3600000, // Set the cookie expiration time
			httpOnly: true,
		},
		credentials: true, // Enable credentials in cross-origin requests
	})
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);

// Error handler
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ message: "Internal Server Error" });
});

db.sequelize.sync().then(() => {
	app.listen(3001, () => {
		console.log("Server running: http://localhost:3001");
	});
});
