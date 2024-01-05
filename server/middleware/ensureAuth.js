const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next(); // User is authenticated, proceed to the next middleware
	}

	// User is not authenticated, send an error response
	res.status(401).json({ message: "Unauthorized" });
}

function ensureAdmin(req, res, next) {
	if (req.user && req.user.Access === "admin") {
		return next(); // User has admin role, proceed to the next middleware
	}

	// User doesn't have admin role, send an error response
	res.status(403).json({ message: "Forbidden - Admin access required" });
}

module.exports = { ensureAuthenticated, ensureAdmin };
