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
		CONFIRMATION: {
			header: 'Review and Pay',
			review: 'Please take a moment to review your order and submit your payment.',
			salesFinal: 'All sales are final.',
			giftInfo: 'Gift Information',
			paymentInfo: 'Payment Information',
			billingInfo: 'Billing Address',
			expires: 'Expires:',
			from: 'From:',
			to: 'To:',
			message: 'Message:'
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
				checkingCoupon: 'Checking Coupon',
				invalidCoupon: 'Invalid Coupon',
				validCoupon: 'Coupon Accepted: %(discount)s off',
				noCoupon: 'No Coupon',
				lockedCoupon: 'Coupon',
				x_creditHours: {
					one: '%(count)s Credit Hour',
					other: '%(count)s Credit Hours'
				}
			},
			SUCCESS: {
				title: 'Gift Purchase Successful',
				info: '<strong>%(courseTitle)s</strong> starts on <strong>%(startDate)s</strong> and will be conducted fully online.',
				toName: 'An email has been sent to <strong>%(name)s</strong> at <strong>%(email)s</strong> with instructions on how to redeem this gift.',
				toEmail: 'An email has been sent to <strong>%(email)s</strong> at with instructions on how to redeem this gift.',
				transactionID: 'Transaction ID:',
				accessKey: 'Access Key:',
				supportPrompt: 'Please contact tech support if you have any issues.'
			},

			cancelPurchaseButton: 'Cancel',
			purchaseButton: 'Purchase Gift',
			agreeToTerms: 'I have read and agree to the <a href="%(url)s" target="_blank">licensing terms</a>.'
		},
		forms: {
			storeenrollment: {
				from: 'Email Address',
				fromLabel: 'This is where we will send your purchase confirmation.',
				name: 'Name on Card',
				number: '1234 1234 1234 1234',
				exp_: 'MM / YY',
				exp_month: 'MM',
				exp_year: 'YY',
				cvc: 'Code',
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

		storeEnrollmentTitle: 'Enroll as a Lifelong Learner',

		fiveMinuteEnrollmentTitle: 'Enroll for Credit',
		fiveMinuteNotAvailableOnMobile: 'Please visit from a desktop or our iPad app to enroll for credit. Coming soon to mobile.'
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
