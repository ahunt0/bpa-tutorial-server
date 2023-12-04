const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Users } = require("../models");
const { comparePassword } = require("../util/helpers");

passport.use(
	new LocalStrategy(
		{
			usernameField: "email", // specify the field name here
			passwordField: "password",
		},
		async (email, password, done) => {
			try {
				// Find user by username
				const user = await Users.findOne({ where: { Email: email } });

				// If user not found, return false
				if (!user) {
					return done(null, false);
				}

				// Compare password
				const passwordMatch = comparePassword(password, user.Password);

				// If password doesn't match, return false
				if (!passwordMatch) {
					return done(null, false);
				}

				// If user found and password matches, return user
				return done(null, user);
			} catch (error) {
				return done(error);
			}
		}
	)
);

// Serialize user
passport.serializeUser((user, done) => {
	done(null, user.UserID);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
	try {
		const user = await Users.findByPk(id);
		done(null, user);
	} catch (error) {
		done(error);
	}
});

module.exports = passport;
