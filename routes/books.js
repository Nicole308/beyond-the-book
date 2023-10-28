// Import base framework for route handling
const express = require('express');
const router = express.Router();

// Imports PrismaClient
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import framework for error handling
const { body, validationResult } = require('express-validator');
require('connect-flash');

// Render all books API returning JSON data (used in search feature)
router.get('/all', async (req, res) => {
	try {
		const books = await prisma.book.findMany({});
		if(books){
			res.json(books);
		} else {
			console.log('books/all error');
		}
	} catch(err){
		console.log('books/all error: ', err);
	} 
});

// Render Add Book
router.get('/add', ensureAuthenticated, async (req, res) => {
	try {
		const distinctGenre = await prisma.genre.findMany({
			distinct: ['genre'],
			select: {
				genre: true,
			},
			orderBy: {
				genre: 'asc'
			}
		});
		res.render('add_book.pug', { distinctGenre });
	} catch(err){
		console.log('books/add error: ', err);
	} finally {
		await prisma.$disconnect();
	}
	
});

// Render Book Genre
router.get('/genre', ensureAuthenticated, async (req, res) => {
	res.render('add_genre.pug');
});

// Render Book Modify
router.get('/modify/:id', ensureAuthenticated, async (req, res) => {
	try {
		const book = await prisma.book.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});
		const distinctGenre = await prisma.genre.findMany({
			distinct: ['genre'],
			select: {
				genre: true,
			},
			orderBy: {
				genre: 'asc'
			}
		});
		if(book && distinctGenre){
			res.render('modify_book.pug', { distinctGenre, book });
		} else {
			console.log('books/modify/:id error');
		}
	} catch(err){
		console.log('books/modify/:id error: ', err);
	} finally {
		await prisma.$disconnect();
	}
});

// Render Page Modify
router.get('/page/modify/:id', ensureAuthenticated, async (req, res) => {
	try {
		const page = await prisma.page.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});
		const book = await prisma.book.findUnique({
			where: {
				id: page.bookID
			}
		});
		const pages = await prisma.page.findMany({
			where: {
				bookID: book.id
			},
			include: {
				histories: true
			},
			orderBy: {
				pageNumber: 'asc'
			}
		});
		if(page && book && pages){
			res.render('modify_page.pug', { page, book, pages });
		} else {
			console.log('books/page/modify/:id error');
		}
	} catch(err){
		console.log('books/page/modify/:id error: ', err);
	} finally {
		await prisma.$disconnect();
	}
	
});

// Render Page conflict
router.get('/page/conflict/:id', ensureAuthenticated, async (req, res) => {
	try {
		const page = await prisma.page.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});
		if(page){
			res.render('modify_page_conflict.pug', { page });
		} else {
			console.log('/page/conflict/:id error');
		} 
	} catch(err){
		console.log('/page/conflict/:id error: ', err);
	} finally {
		await prisma.$disconnect();
	}
});

// Render Delete Book
router.get('/delete/:id', ensureAuthenticated, async (req, res) => {
	try {
		const book = await prisma.book.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});
		const user = await prisma.user.findUnique({
			where: {
				userName: book.authorName
			}
		});
		const page = await prisma.page.findMany({
			where: {
				bookID: book.id
			},
			orderBy: {
				pageNumber: 'asc'
			}
		});
		const genre = await prisma.genre.findFirst({
			where: {
				id: book.genreID
			}
		});
		res.render('delete_book.pug', { book, user, page, genre });
	} catch(err){
		console.log('books/delete/:id error: ', err);
	}
	
});

// Add Genre
router.post('/genre', ensureAuthenticated,
	body('genre', 'Genre is required').notEmpty(),
	body('genre').matches(/^[-a-zA-Z\s]*$/).withMessage('Genre can only contain letters, spaces, and dashes'),
	body('genre').custom(async (value, { req }) => {
		value = await prisma.genre.findMany({});
		value.forEach((genre) => {
			if (genre.genre === titleCase(req.body.genre)) {
				throw new Error('Genre already exist, add a new one or just cancel');

			}
			return true;
		});
	}),	
	async (req, res) => {
		const user = req.user;
		try {
			// Get Errors
			let errors = validationResult(req);

			if (!errors.isEmpty()) {
				res.render('add_genre', {
					errors: errors.array(),
					user: user
				});
			} else {
				await prisma.genre.create({
					data: {
						genre: titleCase(req.body.genre)
					}
				});
				req.flash('success', 'Genre successfully created');
				res.redirect('/books/add');
			}
		} catch (err) {
			new Error('Something went wrong');
			err.status = 404;

			res.render('error', {
				message: err.message,
				error: err
			});
		} finally {
			await prisma.$disconnect();
		}
	});

// Add Book
router.post('/add', ensureAuthenticated,
	body('title', 'Please add a title for your book').notEmpty(),
	body('genre', 'Please choose or add a genre for your book').notEmpty(),
	body('description', 'Please add a brief description of your book').notEmpty(),
	body('description', 'Please limit your description to 200 characters').isLength({ max: 200 }),
	async (req, res) => {
		const distinctGenre = await prisma.genre.findMany({
			distinct: ['genre'],
			select: {
				genre: true,
			},
			orderBy: {
				genre: 'asc'
			}
		});
		const title = req.body.title;
		const description = req.body.description;
		const link = req.body.link;
		const user = req.user;
		const genre1 = req.body.genre;
		try {
			// Get Errors
			let errors = validationResult(req);
			const genre = await prisma.genre.findFirst({
				where: {
					genre: req.body.genre
				}
			});
			if (!errors.isEmpty()) {
				res.render('add_book', {
					errors: errors.array(),
					user: user,
					distinctGenre: distinctGenre,
					title: title,
					description: description,
					link: link,
					genre1: genre1
				});
			} else {
				await prisma.book.create({
					data: {
						title: req.body.title,
						genreID: genre.id,
						description: req.body.description,
						link: req.body.link,
						author: {
							connect: {
								id: req.user.id
							}
						}
					}
				});
				req.flash('success', 'Book successfully created');
				res.redirect('/users/profile');
			}
		} catch (err) {
			new Error('Something went wrong');
			err.status = 404;

			res.render('error', {
				message: err.message,
				error: err
			});
		} finally {
			await prisma.$disconnect();
		}
	});

// Get Single book
router.get('/:id', async (req, res) => {
	try {
		const book = await prisma.book.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});
		const user = await prisma.user.findUnique({
			where: {
				userName: book.authorName
			}
		});
		const page = await prisma.page.findMany({
			where: {
				bookID: book.id
			},
			include: {
				histories: true
			},
			orderBy: {
				pageNumber: 'asc'
			}
		});
		const genre = await prisma.genre.findFirst({
			where: {
				id: book.genreID
			}
		});
		if (user) {
			res.render('books.pug', {
				book: book,
				page: page,
				genre: genre,
				author: user.userName
			});
		}
	} catch (err) {
		new Error('Book doesn\'t exist');
		err.status = 404;

		res.render('error', {
			message: err.message,
			error: err
		});
	} finally {
		await prisma.$disconnect();
	}
});

// Modify Book
router.post('/modify/:id', ensureAuthenticated,
	body('title', 'Title is required').notEmpty(),
	body('description', 'Please add a brief description of your book').notEmpty(),
	body('description', 'Please limit your description to 200 characters').isLength({ max: 255 }),
	ensureAuthenticated, async (req, res) => {
		const book = await prisma.book.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});
		const distinctGenre = await prisma.genre.findMany({
			distinct: ['genre'],
			select: {
				genre: true,
			},
			orderBy: {
				genre: 'asc'
			}
		});
		const user = req.user;
		let errors = validationResult(req);
		const prevTitle = req.body.title;
		const prevGenre = req.body.genre;
		const prevDesc = req.body.description;
		if (!errors.isEmpty()) {
			return res.render('modify_book.pug', {
				errors: errors.array(),
				user: user,
				book: book,
				distinctGenre: distinctGenre,
				prevTitle: prevTitle,
				prevGenre: prevGenre,
				prevDesc: prevDesc
			});
		}
		else {
			// This code can be refined
			try {
				const genre = await prisma.genre.findFirst({
					where: {
						genre: req.body.genre
					}
				});
				await prisma.book.update({
					where: {
						id: parseInt(req.params.id)
					},
					data: {
						title: req.body.title,
						genreID: genre.id,
						description: req.body.description,
					}
				});
				req.flash('success', 'Book updated Successfully');
				res.redirect(`/books/${req.params.id}`);

			} catch (err) {
				new Error('Something went wrong');
				err.status = 404;
	
				res.render('error', {
					message: err.message,
					error: err
				});
			} finally {
				await prisma.$disconnect();
			}
		}
	});

// Get single page
router.get('/page/:id', async (req, res) => {
	try {
		const page = await prisma.page.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});
		const book = await prisma.book.findUnique({
			where: {
				id: page.bookID
			}
		});
		const user = await prisma.user.findUnique({
			where: {
				userName: book.authorName
			}
		});
		const genre = await prisma.genre.findFirst({
			where: {
				id: book.genreID
			}
		});
		const history = await prisma.history.findMany({
			where: {
				pageID: parseInt(req.params.id)
			}
		});
		const allUser = await prisma.user.findMany({
			select: {
				id: true,
				userName: true
			}
		});
		const pages = await prisma.page.findMany({
			where: {
				bookID: book.id
			},
			include: {
				histories: true
			},
			orderBy: {
				pageNumber: 'asc'
			}
		});
		if (user) {
			res.render('page.pug', {
				book: book,
				page: page,
				genre: genre,
				author: user.userName,
				history: history,
				allUser: allUser,
				pages: pages
			});
		}
	} catch (err) {
		new Error('Page doesn\'t exist');
		err.status = 404;

		res.render('error', {
			message: err.message,
			error: err
		});
	} finally {
		await prisma.$disconnect();
	}
});

// Add Page
router.post('/:id', ensureAuthenticated,
	body('chapterName', 'Chapter name should not be empty').notEmpty(),
	body('chapterName', 'Chapter name should not exceed 60 characters').isLength({ max: 60 }),
	body('pageNumber', 'Page number should not be empty').notEmpty(),
	body('pageNumber').custom((value, { req }) => {
		value = parseInt(req.body.pageNumber);
		if (value <= 0 || value > 10000) {
			throw new Error('Page number should be between 1 and 10000');
		}
		return true;
	}),
	body('pageNumber').custom(async (value, { req }) => {
		value = await prisma.page.findMany({
			where: {
				bookID: parseInt(req.params.id)
			}
		});
		value.forEach((page) => {
			if (page.pageNumber === parseInt(req.body.pageNumber)) {
				throw new Error('Page number already exists');

			}
			return true;
		});
	}),
	body('body', 'Page should not be empty').notEmpty(),
	body('body').custom((value, { req }) => {
		value = req.body.body;
		let strippedValue = value.replace(/(<([^>]+)>)/gi, '');
		if (strippedValue.length > 1600) {
			throw new Error('Content should be max 1600 characters long');
		}
		return true;
	}),
	async (req, res) => {
		const book = await prisma.book.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});
		const page = await prisma.page.findMany({
			where: {
				bookID: book.id
			},
			include: {
				histories: true
			},
			orderBy: {
				pageNumber: 'asc'
			}
		});
		const genre = await prisma.genre.findFirst({
			where: {
				id: book.genreID
			}
		});
		const user = req.user;
		try {
			// Get Errors
			let errors = validationResult(req);
			let prevBody = req.body.body;
			let prevChapter = req.body.chapterName;
			let prevPageNumber = req.body.pageNumber;
			if (!errors.isEmpty()) {
				res.render('books', {
					errors: errors.array(),
					user: user,
					book: book,
					page: page,
					genre: genre,
					author: user.userName,
					prevBody: prevBody,
					prevChapter: prevChapter,
					prevPageNumber: prevPageNumber
				});
			} else {
				await prisma.page.create({
					data: {
						chapterName: prevChapter,
						pageNumber: parseInt(prevPageNumber),
						body: prevBody,
						lastUpdatedBy: user.id,
						book: {
							connect: {
								id: parseInt(req.params.id)
							}
						}
					}
				});
				req.flash('success', 'Page successfully created');
				res.redirect(`/books/${book.id}`);
			}
		} catch (err) {
			new Error('Something went wrong');
			err.status = 404;

			res.render('error', {
				message: err.message,
				error: err
			});
		} finally {
			await prisma.$disconnect();
		}
	});

// Approve Requests
router.post('/page/:id', ensureAuthenticated, async (req, res) => {
	const page = await prisma.page.findUnique({
		where: {
			id: parseInt(req.params.id)
		}
	});

	const relatedHistory = await prisma.history.findMany({
		where: {
			pageRef: parseInt(req.params.id)
		},
		select: {
			id: true
		}
	});

	try {
		await prisma.book.update({
			where: {
				id: page.bookID
			},
			data: {
				histories: {
					disconnect: relatedHistory
				}
			}
		});
		await prisma.page.update({
			where: {
				id: parseInt(req.params.id)
			},
			data: {
				chapterName: req.body.chapterName1,
				pageNumber: parseInt(req.body.pageNumber1),
				body: req.body.currBody,
				lastUpdatedBy: parseInt(req.body.updater),
				histories: {
					set: []
				}
			}
		});
		req.flash('success', 'Page update request approved successfully');
		res.redirect(`/books/page/${req.params.id}`);

	} catch (e) {
		res.send(e);
	} 
});

// Modify Page
router.post('/page/modify/:id', ensureAuthenticated,
	body('chapterName', 'Chapter name is required').notEmpty(),
	body('chapterName', 'Chapter name should not exceed 60 characters').isLength({ max: 60 }),
	body('pageNumber', 'Page number is required').notEmpty(),
	body('pageNumber').custom((value, { req }) => {
		value = parseInt(req.body.pageNumber);
		if (value <= 0 || value > 10000) {
			throw new Error('Page number should be between 1 and 10000');
		}
		return true;
	}),
	body('pageNumber').custom(async (value, { req }) => {
		const currentPage = await prisma.page.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});
		value = await prisma.page.findMany({
			where: {
				bookID: currentPage.bookID
			}
		});
		value.forEach((page) => {
			if (currentPage.pageNumber !== parseInt(req.body.pageNumber)) {
				if (page.pageNumber === parseInt(req.body.pageNumber)) {
					throw new Error('Page number already exists');

				}
			}
			return true;
		});
	}),
	body('body', 'Content is required').notEmpty(),
	body('body').custom((value, { req }) => {
		value = req.body.body;
		let strippedValue = value.replace(/(<([^>]+)>)/gi, '');
		if (strippedValue.length > 1600) {
			throw new Error('Content should be max 1600 characters long');
		}
		return true;
	}),
	body('commit', 'Commit message is required').notEmpty(),
	async (req, res) => {
		const page = await prisma.page.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});
		const book = await prisma.book.findUnique({
			where: {
				id: page.bookID
			}
		});
		const pages = await prisma.page.findMany({
			where: {
				bookID: book.id
			},
			include: {
				histories: true
			},
			orderBy: {
				pageNumber: 'asc'
			}
		});
		const relatedHistory = await prisma.history.findMany({
			where: {
				pageRef: parseInt(req.params.id)
			},
			select: {
				id: true
			}
		});
		const user = req.user;
		let errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.render('modify_page.pug', {
				errors: errors.array(),
				page: page,
				user: user,
				book: book,
				pages: pages
			});
		}
		else {
			if (user.userName === book.authorName) {
				try {
					await prisma.book.update({
						where: {
							id: page.bookID
						},
						data: {
							histories: {
								disconnect: relatedHistory
							}
						}
					});
					await prisma.page.update({
						where: {
							id: parseInt(req.params.id)
						},
						data: {
							chapterName: req.body.chapterName,
							pageNumber: parseInt(req.body.pageNumber),
							body: req.body.body,
							lastUpdatedBy: parseInt(user.id),
							histories: {
								set: []
							}
						}
					});
					await prisma.history.create({
						data: {
							userID: user.id,
							prevBody: req.body.tempBody,
							currBody: req.body.body,
							commit: req.body.commit,
							pageRef: parseInt(req.params.id),
							bookRef: book.id
						}
					});
					req.flash('success', 'Page updated Successfully');
					res.redirect(`/books/page/${req.params.id}`);

				} catch (err) {
					new Error('Something went wrong');
					err.status = 404;
		
					res.render('error', {
						message: err.message,
						error: err
					});
				}
			} else {
				const currentPageBody = page.body.split('');
				const prevPageBody = req.body.tempBody.split('');

				let isDifferent = false;

				var limit = currentPageBody.length > prevPageBody.length ? currentPageBody.length : prevPageBody.length;

				for (let i = 0; i < limit; i++) {
					if (currentPageBody[i] !== prevPageBody[i]) {
						isDifferent = true;
					}
				}

				if (isDifferent) {
					const currVal = req.body.body;
					res.render('modify_page_conflict', { user, page, currVal });

				} else {
					try {
						await prisma.history.create({
							data: {
								userID: user.id,
								prevBody: req.body.tempBody,
								currBody: req.body.body,
								commit: req.body.commit,
								pageRef: parseInt(req.params.id),
								bookRef: book.id,
								book: {
									connect: {
										id: book.id
									}
								},
								page: {
									connect: {
										id: parseInt(req.params.id)
									}
								}
							}
						});
						req.flash('success', 'Page update request submitted successfully');
						res.redirect(`/books/page/${req.params.id}`);

					} catch (err) {
						new Error('Something went wrong');
						err.status = 404;
			
						res.render('error', {
							message: err.message,
							error: err
						});
					} finally {
						await prisma.$disconnect();
					}
				}
			}
		}
	});

// Modify page conflict
router.post('/page/conflict/:id', ensureAuthenticated,
	body('chapterName', 'Chapter name is required').notEmpty(),
	body('chapterName', 'Chapter name should not be empty').isLength({ max: 60 }),
	body('pageNumber', 'Page number is required').notEmpty(),
	body('pageNumber').custom((value, { req }) => {
		value = parseInt(req.body.pageNumber);
		if (value <= 0) {
			throw new Error('Page number should not be equal or less than 0');
		}
		return true;
	}),
	body('pageNumber').custom(async (value, { req }) => {
		const currentPage = await prisma.page.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});
		value = await prisma.page.findMany({
			where: {
				bookID: currentPage.bookID
			}
		});
		value.forEach((page) => {
			if (currentPage.pageNumber !== parseInt(req.body.pageNumber)) {
				if (page.pageNumber === parseInt(req.body.pageNumber)) {
					throw new Error('Page number already exists');

				}
			}
			return true;
		});
	}),
	body('body', 'Content is required').notEmpty(),
	body('body').custom((value, { req }) => {
		value = req.body.body;
		let strippedValue = value.replace(/(<([^>]+)>)/gi, '');
		if (strippedValue.length > 1600) {
			throw new Error('Content should be max 1600 characters long');
		}
		return true;
	}),
	body('commit', 'Commit message is required').notEmpty(),
	async (req, res) => {
		const page = await prisma.page.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});
		const book = await prisma.book.findUnique({
			where: {
				id: page.bookID
			}
		});
		const user = req.user;
		let errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.render('modify_page_conflict.pug', {
				errors: errors.array(),
				page: page,
				user: user,
				book: book
			});
		}
		else {
			const currentPageBody = page.body.split('');
			const prevPageBody = req.body.tempBody.split('');
			const currVal = req.body.body;

			let isDifferent = false;

			var limit = currentPageBody.length > prevPageBody.length ? currentPageBody.length : prevPageBody.length;

			for (let i = 0; i < limit; i++) {
				if (currentPageBody[i] === prevPageBody[i]) {
					isDifferent = false;
				}
				else {
					isDifferent = true;
				}
			}

			if (isDifferent) {
				res.render('modify_page_conflict.pug', { user, page, currVal });

			}
			else {

				try {
					await prisma.history.create({
						data: {
							userID: user.id,
							prevBody: req.body.tempBody,
							currBody: req.body.body,
							commit: req.body.commit,
							pageRef: parseInt(req.params.id),
							bookRef: book.id,
							book: {
								connect: {
									id: book.id
								}
							},
							page: {
								connect: {
									id: parseInt(req.params.id)
								}
							}
						}
					});
					req.flash('success', 'Page update request submitted successfully');
					res.redirect(`/books/page/${req.params.id}`);

				} catch (err) {
					new Error('Something went wrong');
					err.status = 404;
		
					res.render('error', {
						message: err.message,
						error: err
					});
				} finally {
					await prisma.$disconnect();
				}
			}
		}
	});

// Post request access
router.post('/request/:id', ensureAuthenticated,
	body('request', 'Please send the author a request message.').notEmpty(),
	async (req, res) => {
		const book = await prisma.book.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});
		const user = req.user;
		try {
			// Get Errors
			let errors = validationResult(req);

			if (!errors.isEmpty()) {
				res.render('books', {
					errors: errors.array(),
					user: user,
					book: book
				});
			} else {
				await prisma.request.create({
					data: {
						bookID: parseInt(req.params.id),
						userID: parseInt(req.user.id),
						message: req.body.request,
						bookOwner: {
							connect: {
								id: book.id
							}
						}
					}
				});
				req.flash('success', 'Request successfully sent to author');
				res.redirect(`/books/${book.id}`);
			}
		} catch (err) {
			new Error('Something went wrong');
			err.status = 404;

			res.render('error', {
				message: err.message,
				error: err
			});
		}

	});

// Delete Book
router.delete('/delete/:id', ensureAuthenticated, async (req, res) => {
	try {
		await prisma.page.deleteMany({
			where: {
				bookID: parseInt(req.params.id)
			}
		});
		await prisma.book.delete({
			where: {
				id: parseInt(req.params.id)
			}
		});
		req.flash('success', 'Book successfully deleted');
		res.status(200).send('Successfully deleted');
	} catch(err){
		console.log('books/delete/:id error: ', err);
	} finally {
		await prisma.$disconnect();
	}
	
});

// Delete Page
router.delete('/page/delete/:id', ensureAuthenticated, async (req, res) => {
	try {
		await prisma.page.delete({
			where: {
				id: parseInt(req.params.id)
			}
		});
		req.flash('success', 'Page successfully deleted');
		res.status(200).send('Successfully deleted');
	} catch(err){
		console.log('books/page/delete/:id error: ', err);
	} finally {
		await prisma.$disconnect();
	}
	
});

// Access Control
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('danger', 'Please login');
		res.redirect('/users/login');
	}
}

// catch 404 and forward to error handler
router.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;

	//pass error to the next matching route.
	next(err);
});

// handle error, print stacktrace
router.use(function (err, res) {
	res.status(err.status || 500);

	res.render('error', {
		message: err.message,
		error: err
	});
});

// Title Case Genre
function titleCase(str) {
	if (str.includes(' ')) {
		return str.trim().toLowerCase().split(' ').map(function (word) {
			return (word.charAt(0).toUpperCase() + word.slice(1));
		}).join(' ');
	}
	else {
		return str.trim().toLowerCase().split('-').map(function (word) {
			return (word.charAt(0).toUpperCase() + word.slice(1));
		}).join('-');
	}
}

module.exports = router;

// // Render request access (This is supposed to be for the feature that an author can control the amount of collaborators in a book)
// router.get('/request/:id', ensureAuthenticated, async (req, res) => {
// 	const book = await prisma.book.findUnique({
// 		where: {
// 			id: parseInt(req.params.id)
// 		}
// 	})
// 	res.render('request_access.pug', { book })
// })