const LocalStrategy = require('passport-local').Strategy;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcrypt');

module.exports = function (passport) {
	// Local Strategy
	passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
		try {
			// Query to check if user with given email address already exists
			const user = await prisma.user.findFirst({ where: { email } });
			if (!user)
				return done(null, false, {
					message: 'Sorry, we can\'t find an account with this email address. Please try again or create a new account.',
					statusCode: 400
				});
			// Compare hashed password against user password
			const validPassword = await bcrypt.compare(password, user.password);
			if (!validPassword)
				return done(null, false, {
					message: 'Login Failed! Your password is incorrect. Please try again.',
					statusCode: 401
				});
			return done(null, user);
		} catch (err) {
			console.error(err.message);
			return done(null, err);
		}
	}));
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async(id, done) => {
		try {
			const user = await prisma.user.findFirst({ where: { id } });
			done(null, user);
		} catch(err){
			console.error(err.message);
			done(err, null);
		}
	});
};