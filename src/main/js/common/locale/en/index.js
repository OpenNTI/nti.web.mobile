/* FIXME inconsistent character casing all over this thing

	The convention GOING forward: Containers ALL_CAPS, leaf properties/pluralized-
	forms(and their states one, other, zero etc) are camelCased. {@see UNITS block}.
*/

import units from './partials/units';
import course from './partials/course';
import content from './partials/content';
import forums from './partials/forums';
import enrollment from './partials/enrollment';
import library from './partials/library';
import login from './partials/login';
import soon from './partials/coming-soon';
import profile from './partials/profile';

export default {
	GLOBAL: {
		siteName: 'next thought'
	},

	UNITS: units,

	FORUMS: forums,

	COMING_SOON: soon,

	LOGIN: login,

	ENROLLMENT: enrollment,

	LIBRARY: library,

	PROFILE: profile,

	BUTTONS: {
		ok: 'Okay',
		cancel: 'Cancel',
		save: 'Save'
	},

	LISTS: {
		noMatches: 'No items match the selected filter.',
		emptyList: 'This list is empty.',
		'emptyList:discussions': 'No discussions.',
		'emptyList:library-admin': 'No Administered Courses.',
		'emptyList:library-courses': 'You don\'t have any courses yet...'
	},

	CONTENT: content,
	COURSE: course,

	ASSESSMENT: {
		checkit: 'Check It!',
		submit: 'I\'m Finished!',
		reset: 'Cancel',
		tryagain: 'Try Again',
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
			}
		}
	}

};
