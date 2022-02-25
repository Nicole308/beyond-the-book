const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Import framework for error handling
const { body, validationResult } = require('express-validator')

// Render Register Form
router.get('/register', async (req, res) => {
	res.render('register.pug');
})

// Register Process
router.post('/register',

	body('userName', "Username is required").notEmpty(),
	body('userName', 'Username should at least be 2 characters long').isLength(2),
	body('firstName', 'Firstname is required').notEmpty(),
	body('firstName', 'Firstname should at least be 2 characters long').isLength(2),
	body('lastName', 'Lastname is required').notEmpty(),
	body('lastName', 'Lastname should at least be 2 characters long').isLength(2),
	body('birthday', 'Birthday is required').notEmpty(),
	body('email', 'Email is required').notEmpty(),
	body('email', 'Email is not valid').isEmail(),
	body('password', 'Password is required').notEmpty(),
	body('password', 'Password must have 8 characters').isLength(8),
	body('password2', 'Passwords do not match').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Passwords do not match')

		}
		return true;
	}), checkExisting, async (req, res) => {


		let errors = validationResult(req)

		if (!errors.isEmpty()) {
			res.render('register.pug', {
				errors: errors.array()
			})
		}
		else {
			const hashedPassword = await bcrypt.hash(req.body.password, 10)
			// This code can be refined
			try {
				if (res.username != null && res.email != null) {
					req.flash('failure', 'Username and email already taken, please choose different ones')
					return res.redirect('/users/register')
				}
				if (res.username != null) {
					req.flash('failure', 'Username already taken, please use a different username')
					return res.redirect('/users/register')
				}
				if (res.email != null) {
					req.flash('failure', 'Email is already registered, please use a different email')
					return res.redirect('/users/register')
				}
				else {
					const newUser = await prisma.user.create({
						data: {
							userName: req.body.userName,
							firstName: req.body.firstName,
							lastName: req.body.lastName,
							birthday: new Date(req.body.birthday),
							email: req.body.email.toLowerCase(),
							password: hashedPassword
						}
					})
					req.flash('success', 'You are now registered and can log in')
					res.redirect('/users/login')
				}
			} catch (e) {
				res.send(e)
			}
		}
	})

// Render Login Form
router.get('/login', async (req, res) => {
	res.render('login.pug')
})

// Render Profile page
router.get('/profile', async (req, res) => {
	res.render('profile.pug')
})

// Render Modify page
router.get('/modify', async (req, res) => {
	res.render('modify.pug')
})

// Modify User
router.post('/modify',
	body('firstName', 'Firstname is required').notEmpty(),
	body('firstName', 'Firstname should at least be 2 characters long').isLength(2),
	body('lastName', 'Lastname is required').notEmpty(),
	body('lastName', 'Lastname should at least be 2 characters long').isLength(2),
	body('birthday', 'Birthday is required').notEmpty(),
	body('current_password', 'Current Password is required').notEmpty(),
	body('new_password', 'Password must have 8 characters').isLength(8),
	body('confirm_new_password').custom((value, { req }) => {
		if (value !== req.body.new_password) {
			throw new Error('Passwords do not match')

		}
		return true;
	}), ensureAuthenticated, async (req, res) => {
		const validPassword = await bcrypt.compare(req.body.current_password, req.user.password)
		let errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.render('modify.pug', {
				errors: errors.array()
			})
		}
		if (!validPassword) {
			req.flash('failure', "Current password is not equal to your old password")
			return res.redirect('/users/modify')
		}
		else {
			const hashedPassword = await bcrypt.hash(req.body.new_password, 10)
			// This code can be refined
			try {
				const updateUser = await prisma.user.update({
					where: {
						email: req.user.email
					},
					data: {
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						birthday: new Date(req.body.birthday),
						password: hashedPassword
					}
				})
				req.flash('success', 'Updated Successfully')
				res.redirect('/users/login')

			} catch (e) {
				res.send(e)
			}
		}
	})

// Login Process
router.post('/login', async (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/users/profile',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next)
})

// logout
router.get('/logout', async (req, res) => {
	req.logout()
	req.flash('success', 'You are successfully logged out')
	req.flash('success', 'Thanks for using OpenSource TextBook!')
	res.redirect('/users/login')
})

// This code can be refined
async function checkExisting(req, res, next) {
	const email = await prisma.user.findUnique({
		where: {
			email: req.body.email
		},
		select: {
			email: true
		}
	})
	const username = await prisma.user.findUnique({
		where: {
			userName: req.body.userName
		},
		select: {
			userName: true
		}
	})
	res.email = email
	res.username = username
	return next()
}

// Access Control
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('danger', 'Please login');
		res.redirect('/users/login');
	}
}

module.exports = router