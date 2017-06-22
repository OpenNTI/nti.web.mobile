import UNITS from './partials/units';
import ACTIVITY from './partials/activity';
import ASSESSMENTS from './partials/assessments';
import COURSE from './partials/course';
import CONTACTS from './partials/contacts';
import CONTENT from './partials/content';
import ERROR_MESSAGES from './partials/error-messages';
import FORUMS from './partials/forums';
import INVITATIONS from './partials/invitations';
import ENROLLMENT from './partials/enrollment';
import LIBRARY from './partials/library';
import LOGIN from './partials/login';
import COMING_SOON from './partials/coming-soon';
import PROFILE from './partials/profile';

export default {

	UNITS,

	DISCUSSIONS: {
		ACTIONS: {
			reply: 'Reply',
			share: 'Share',
			edit: 'Edit',
			flag: 'Report',
			flagged: 'Reported',
			delete: 'Delete'
		},
		postedBy: 'Posted by %(name)s',
		viewComments: 'View Comments'
	},

	ACTIVITY,

	ASSESSMENTS,

	FORUMS,

	COMING_SOON,

	CONTACTS,

	LOGIN,

	ENROLLMENT,

	INVITATIONS,

	ERROR_MESSAGES,

	LIBRARY,

	PROFILE,

	BUTTONS: {
		ok: 'Okay',
		cancel: 'Cancel',
		save: 'Save',
		post: 'Post'
	},

	CONTENT,
	COURSE,

	ASSESSMENT: {
		submit: 'I\'m Finished!',
		reset: 'Cancel',

		'naquestion-reset': 'Try Again',
		'naquestion-submit': 'Check It!',
		'naquestionfillintheblankwordbank-reset': 'Try Again',
		'naquestionfillintheblankwordbank-submit': 'Check It!',
		'napoll-reset': 'Submitted',
		'napoll-submit': 'Submit',

		unanswered: {
			zero: 'All questions answered',
			one: '%(count)s question unanswered',
			other: '%(count)s questions unanswered'
		},

		ASSIGNMENTS: {
			FEEDBACK: {
				title: 'Feedback',
				description: 'The comments below will only be visible to you and your instructor.',
				entryPlaceholder: 'Add a comment'
			},
			GROUP_LABELS: {
				Unknown: 'Other Assignments',
				'no-due-date': 'Other',
				unset: ''
			}
		}
	}

};
