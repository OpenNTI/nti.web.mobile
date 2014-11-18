/* jshint -W101 */
/* jshint -W106 */
/* FIXME inconsistent character casing all over this thing */
module.exports = {
	GLOBAL: {
		SITE_NAME: 'NextThought'
	},
	LOGIN: {
		login: 'Log In',
		PasswordPlaceholder: 'Password',
		UsernamePlaceholder: 'Username',
		signup: {
			submit:'Create Account',
			link:'No account? Sign up.'
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
			},
		}
	},

	FILTER: {
		no_matches: 'No items match the selected filter.'
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
			viewCourse: 'View Course'
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
