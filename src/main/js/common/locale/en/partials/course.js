import activity from './assignments-activity';


export default {
	CONTACTINFO: {
		LINK0: {
			label: 'Support',
			link: 'mailto:support@nextthought.com' 
		},
		LINK1: {
			label: 'Info',
			link: 'mailto:info@nextthought.com'
		},
		LINK2: {
			label: 'NextThought Website',
			link: 'http://nextthought.com'
		}
	},

	INFO: {
		OpenEnrolled: 'You\'re registered for the open course.',
		OpenEnrolledIsNotForCredit: '(No Credit)',
		CreditHours: 'Credit Hours',
		CREDIT: {
			available: 'available'
		},
		NoPrerequisites: 'There are no prerequisites for this course.',
		SchoolLabel: 'School / Department',
		StartDate: 'Start Date',
		Duration: 'Duration',
		DurationUnits: 'Weeks',
		DaysAndTimes: 'Day & Time',
		OnlyOnline: 'Fully Online',
		Instructor: 'Course Instructor'
	},

	SECTIONS: {
		activity: 'Activity',
		assignments: 'Assignments',
		discussions: 'Discussions',
		lessons: 'Lessons',
		info: 'Course Info',
		videos: 'Videos'
	},

	ASSIGNMENTS: {
		ACTIVITY: activity
	}
};
