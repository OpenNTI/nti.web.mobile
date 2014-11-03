/* jshint -W101 */
/* jshint -W106 */
module.exports = {
	GLOBAL: {
		SITE_NAME: 'NextThought'
	},
	LOGIN: {
		login: 'Log In',
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
		SIGNUP_CONFIRMATION: 'If you are a current student at the University of Oklahoma, you don\'t need to create an account. Log in with your OUNet ID (4+4).',

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
			'OpenEnrollment': 'Enroll in the open course',
			'drop': 'Drop this course'
		}
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
	}

};
