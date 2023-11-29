const bcrypt = require("bcrypt");

function hashPassword(password) {
	const salt = bcrypt.genSaltSync(); // Generates a salt
	return bcrypt.hashSync(password, salt); // Returns hashed password
}

function comparePassword(raw, hash) {
	return bcrypt.compareSync(raw, hash); // Returns true if the raw password matches the hash
}

module.exports = {
	hashPassword,
	comparePassword,
};
