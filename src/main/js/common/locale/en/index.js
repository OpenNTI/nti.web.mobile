/* FIXME inconsistent character casing all over this thing

	The convention GOING forward: Containers ALL_CAPS, leaf properties/pluralized-
	forms(and their states one, other, zero etc) are camelCased. {@see UNITS block}.
*/

import UNITS from './partials/units';
import ACTIVITY from './partials/activity';
import COURSE from './partials/course';
import CONTACTS from './partials/contacts';
import CONTENT from './partials/content';
import ERROR_MESSAGES from './partials/error-messages';
import FORUMS from './partials/forums';
import ENROLLMENT from './partials/enrollment';
import LIBRARY from './partials/library';
import LOGIN from './partials/login';
import COMING_SOON from './partials/coming-soon';
import PROFILE from './partials/profile';

export default {

	UNITS,

	ACTIVITY,

	FORUMS,

	COMING_SOON,

	CONTACTS,

	LOGIN,

	ENROLLMENT,

	ERROR_MESSAGES,

	LIBRARY,

	PROFILE,

	BUTTONS: {
		ok: 'Okay',
		cancel: 'Cancel',
		save: 'Save',
		post: 'Post'
	},

	LISTS: {
		noMatches: 'No items match the selected filter.',
		emptyList: 'This list is empty.',
		'emptyList:discussions': 'No discussions.',
		'emptyList:lesson-overview': 'Empty Overview :(\nThis lesson is missing content.',
		'emptyList:library-admin': 'No Administered Courses.',
		'emptyList:library-books': 'You don\'t have any books.',
		'emptyList:library-courses': 'You don\'t have any courses yet.',
		'emptyList:library-community': 'You are\'t in any communities yet.',
		'emptyList:videos': 'No videos.',
		'emptyList:activity': 'No Activity.',
		'emptyList:user-details': 'Empty Profile :(\nNo additional profile information available.',
		'emptyList:memberships': 'No memberships',
		'emptyList:friendslists': 'No Lists.',
		'emptyList:dynamicfriendslists': 'No Groups.',
		'emptyList:contacts': 'No contacts.',
		'emptyList:contactssearch': 'No contacts found.',
		'emptyList:entity-search': 'No one found',
		'emptyList:assignments': 'No assignments currently available.'
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
			}
		}
	}

};
