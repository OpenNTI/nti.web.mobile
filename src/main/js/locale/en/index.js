import units from './partials/units';
import errorMessages from './partials/error-messages';
import login from './partials/login';
import comingSoon from './partials/coming-soon';

export default {

	app: {
		login
	},

	common: {
		buttons: {
			ok: 'Okay',
			cancel: 'Cancel',
			save: 'Save',
			post: 'Post'
		},

		comingSoon,

		errorMessages,

		units,
	},
};
