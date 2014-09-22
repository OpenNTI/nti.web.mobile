module.exports = {

	LOGIN: {
		login: 'Log In',
		oauth: {
			login: 'Log in with %(service)s'
		},
		LOGIN_ERROR: {
			401: 'Login failed.'
		},	
	},

	NAV: {
		Library: {
			library:'Library',
			books: 'Books',
			courses: 'Courses',
			instructing: 'Instructing',
			catalog:'Catalog'
		}
	},

	COURSE_INFO: {
		OpenEnrolled: 'You\'re registered for the open course.',
		OpenEnrolledIsNotForCredit: '(No Credit)',
		Credit: {
			available: 'available',
			x_units: {
				one:   '%(count)s Credit',
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

	VIDEO: {
		KalturaIFrameUrl:'http://www.kaltura.com/p/%(partnerId)s/sp/%(partnerId)s00/embedIframeJs/uiconf_id/%(uiConfId)s/partner_id/%(partnerId)s?iframeembed=true&playerId={UNIQUE_OBJ_ID}&entry_id=%(entryId)s'
	}
}
