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
			viewCatalog: 'View Catalog',
			giveThisAsGift: 'Give this as a gift',
			redeemGift: 'Redeem a gift'
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
				toSender: 'We\'ve sent an email of this transaction to you at <a>%(sender)s</a>. ' +
							'We\'ve also sent a separate email that contains instructions on how to redeem this gift.',
				alert: 'Please be sure to pass this information along to the gift recipient in time to take advantage of the course.',
				toRecipient: 'We\'ve sent an email of this transaction to you at <a>%(sender)s</a>. ' +
								'We\'ve also sent you a copy of the gift notification that was sent to <a>%(receiver)s</a> ' +
								'with instructions on how to redeem this gift.',
				support: 'Please contact %(email)s if you have any issues.',
				transactionID: 'Transaction ID:',
				accessKey: 'Access Key:',
				supportPrompt: 'Please contact tech support if you have any issues.'
			},

			REDEEM: {
				'formTitle': 'Redeem this course with an Access Key',
				'accessKey': 'Access Key',
				'redeemButton': 'Redeem'
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
			},
			fiveminute: {
				admissionTitle: 'Preliminary Questions',
				currentlyAttending: 'Are you currently attending the University of Oklahoma?',
				oklahomaResidentHighSchool: 'Are you an Oklahoma resident currently attending high school?',
				fullName: 'Full Name',
				formerLastName: 'Do you have a former last name?',
				genderPrompt: 'What is your gender?',
				address1: 'Address',
				address2: 'Address Continued',
				city: 'City',
				state: 'State',
				zip: 'Zip',
				country: 'Country',
				mailingAddressDifferent: 'My mailing address is different.',
				mailAddress1: 'Address',
				mailAddress2: 'Address Continued',
				mailCity: 'City',
				mailState: 'State',
				mailZip: 'Zip',
				mailCountry: 'Country',
				phone: 'Phone Number',
				email: 'email Address',
				ssn: 'Social Security Number',
				citizen: 'Are you a U.S. citizen?',
				residentOf: 'I am a resident of',
				okResident: 'Are you a resident of Oklahoma?',
				okResidentFor: 'How many years have you been an Oklahoma resident?',
				hsGraduate: 'Are you a high school graduate?',
				attendedOU: 'Have you ever attended the University of Oklahoma?',
				soonerId: 'What was your Sooner ID?',
				leaveSoonerIdBlankIfUnknown: 'Leave this field blank if you do not remember your Sooner ID.',
				attendedAnotherUniversity: 'Have you ever attended another college or university?',
				stillAttending: 'I am still attending.',
				obtainedDegree: 'I have obtained a Bachelor\'s degree or higher.',
				goodAcademicStanding: 'I am in good academic standing.',
				signatureAgreement: 'I affirm that I am not prohibited from enrolling in any University of Oklahoma program. I understand that submitting any false information to the University, including but not limited to, any information contained on this form, or withholding information about my previous academic history will make my application for admission to the University, as well as any future applications, subject to denial, or will result in expulsion from the University. I pledge to conduct myself with academic integrity and abide by the tenets of The University of Oklahoma\'s <a href="http://integrity.ou.edu/" target="_blank">Integrity Pledge.</a>'
			}
		},
		incompleteForm: 'Please complete all required fields.',
		requiredField: 'Field is required.',

		invalidExpiration: 'Expiration is invalid.',
		invalidCardNumber: 'Card number is invalid.',
		invalidCVC: 'CVC is invalid.',

		invalidEmail: 'Invalid Email.',
		invalidRecipient: 'Invalid Recipient Email.',

		enrollmentNotRefundable: 'Enrollment is not refundable.',

		enrollAsLifelongLearner: 'Enroll as a Lifelong Learner',
		enrollAsLifelongLearnerWithPrice: 'Enroll as a Lifelong Learner: %(price)s',

		storeEnrollmentTitle: 'Enroll as a Lifelong Learner',

		fiveMinuteEnrollmentTitle: 'Enroll for Credit',
		fiveMinuteNotAvailableOnMobile: 'Please visit from a desktop to enroll for credit. Coming soon to mobile.',
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
