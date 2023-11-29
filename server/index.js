const express = require("express");
const app = express();

const db = require("./models");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
const authRouter = require("./routes/Auth");
app.use("/api/v1/auth", authRouter);

db.sequelize.sync().then(() => {
	app.listen(3001, () => {
		console.log("Server running: http://localhost:3001");
	});
});
