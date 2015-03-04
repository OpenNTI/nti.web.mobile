/* FIXME inconsistent character casing all over this thing

	The convention GOING forward: Containers ALL_CAPS, leaf properties/pluralized-
	forms(and their states one, other, zero etc) are camelCased. {@see UNITS block}.
*/

import units from './partials/units';
import course from './partials/course';
import forums from './partials/forums';
import enrollment from './partials/enrollment';
import library from './partials/library';
import login from './partials/login';
import soon from './partials/coming-soon';

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

	BUTTONS: {
		ok: 'Okay',
		cancel: 'Cancel',
		save: 'Save'
	},

	FILTER: {
		noMatches: 'No items match the selected filter.',
		emptyList: 'This list is empty.'
	},


	COURSE: course,

	ASSESSMENT: {
		submit: 'I\'m Finished!',
		reset: 'Cancel',
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
