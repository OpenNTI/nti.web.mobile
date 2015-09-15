/* FIXME inconsistent character casing all over this thing

	The convention GOING forward: Containers ALL_CAPS, leaf properties/pluralized-
	forms(and their states one, other, zero etc) are camelCased. {@see UNITS block}.
*/

import units from './partials/units';
import course from './partials/course';
import contacts from './partials/contacts';
import content from './partials/content';
import errorMessages from './partials/error-messages';
import forums from './partials/forums';
import enrollment from './partials/enrollment';
import library from './partials/library';
import login from './partials/login';
import soon from './partials/coming-soon';
import profile from './partials/profile';

export default {

	UNITS: units,

	FORUMS: forums,

	COMING_SOON: soon,

	CONTACTS: contacts,

	LOGIN: login,

	ENROLLMENT: enrollment,

	ERROR_MESSAGES: errorMessages,

	LIBRARY: library,

	PROFILE: profile,

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
		'emptyList:entity-search': 'No one found'
	},

	CONTENT: content,
	COURSE: course,

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
