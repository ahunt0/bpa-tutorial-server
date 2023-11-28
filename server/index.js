const express = require("express");
const app = express();

// Routers
const authRouter = require("./routes/Auth");
app.use("api/v1/auth", authRouter);

app.listen(3001, () => {
	console.log("Server running: http://localhost:3001");
});
