/* jshint -W101 */
/* jshint -W106 */
/* FIXME inconsistent character casing all over this thing */
module.exports = {
	GLOBAL: {
		SITE_NAME: 'NextThought'

	},
	BUTTONS: {
		OK: 'Okay'
	},
	LOGIN: {
		login: 'Log In',
		PasswordPlaceholder: 'Password',
		UsernamePlaceholder: 'Username',
		signup: {
			submit: 'Create Account',
			link: 'No account? Sign up.'
		},
		oauth: {
			login: 'Log in with %(service)s'
		},
		forgot: {
			username: 'Forgot Username?',
			password: 'Forgot Password?',
			recoverpassword: 'Reset Password',
			recoverusername: 'Recover Username',
			EmailAddressInvalid: 'The email address you have entered is not valid.'
		},

		LOGIN_ERROR: {
			401: 'Login failed.'
		},
		forms: {
			createaccount: {
				fname: 'First Name',
				lname: 'Last Name',
				email: 'email',
				Username: 'Username',
				password: 'Password',
				password2: 'Verify Password'
			}
		}
	},

	FILTER: {
		no_matches: 'No items match the selected filter.',
		empty_list: 'This list is empty.'
	},

	NAV: {
		Home: 'Home',
		Library: {
			library: 'Library',
			books: 'Books',
			courses: 'Courses',
			instructing: 'Instructing',
			catalog: 'Catalog'
		}
	},

	ENROLLMENT: {
		BUTTONS: {
			OpenEnrollment: 'Enroll in the open course',
			drop: 'Drop this course',
			viewCourse: 'View Course',
			viewCatalog: 'View Catalog'
		},
		GIFT: {
			HEADER: {
				title: 'Gift Information',
				description: 'If you would like for us to send a gift notification to the person for whom you are purchasing this course, ' +
								'please enter their name and email below. Pricing information is not included in this notification.'
			},
			RECIPIENT: {
				enable: 'Send a gift notification to:',
				firstName: 'First Name',
				lastName: 'Last Name',
				email: 'Email Address',
				message: 'Enter your message here...',
				fromLabel: 'From:',
				from: 'Your Name',
				sendDate: 'This notification will be sent upon completion of purchase.'
			},
			PAYMENT: {
				title: 'Payment Information',
				sub: ''
			},
			PRICING: {
				subType: 'Enrollment Type',
				total: 'total',
				begins: 'Course Begins',
				ends: 'Course Ends',
				hours: 'Credit Hours',
				refunds: 'Refunds',
				noRefunds: 'Not Refundable',
				couponPlaceholder: 'Coupon Code',
				coupon: 'I have a coupon',
				invalidCoupon: 'Invalid Coupon',
				validCoupon: 'Coupon Accepted: %(discount)s off'
			}
		},
		forms: {
			storeenrollment: {
				name: 'Name',
				number: 'Card number',
				exp_month: 'MM',
				exp_year: 'YY',
				cvc: 'CVC',
				address_line1: 'Address',
				address_line2: 'Address Continued',
				address_city: 'City',
				address_state: 'State/Province/Territory/Region',
				address_zip: 'Zip/Postal Code',
				address_country: 'Country',
				last4: 'Card ending in'
			}
		},
		incompleteForm: 'Please complete all required fields.',
		requiredField: 'Field is required.',

		invalidExpiration: 'Expiration is invalid.',
		invalidCardNumber: 'Card number is invalid.',
		invalidCVC: 'CVC is invalid.',

		enrollmentNotRefundable: 'Enrollment is not refundable.',

		enrollAsLifelongLearner: 'Enroll as a Lifelong Learner',
		enrollAsLifelongLearnerWithPrice: 'Enroll as a Lifelong Learner: %(price)s',

		NO_STRIPE_TOKEN: 'Utoh. Couldn\'t find payment info. (This can occur if you navigate to the confirmation view directly or if you reload.)'
	},

	COURSE_INFO: {
		OpenEnrolled: 'You\'re registered for the open course.',
		OpenEnrolledIsNotForCredit: '(No Credit)',
		Credit: {
			available: 'available',
			x_units: {
				one: '%(count)s Credit',
				other: '%(count)s Credits'
			}
		},
		NoPrerequisites: 'There are no prerequisites for this course.',
		SchoolLabel: 'School / Department',
		StartDate: 'Start Date',
		Duration: 'Duration',
		DurationUnits: 'Weeks',
		Days: 'Days',
		OnlyOnline: 'Fully Online',
		Instructor: 'Course Instructor'
	},

	ASSESSMENT: {
		submit: 'I\'m Finished!',
		reset: 'Cancel',
		x_unanswered: {
			zero: 'All questions answered',
			one: '%(count)s question unanswered',
			other: '%(count)s questions unanswered'
		}
	}

};
