import soon from './partials/coming-soon';
import library from './partials/library';

export default {
	LOGIN: {
		UsernamePlaceholder: 'Username or OU 4+4',
		SIGNUP_CONFIRMATION: 'If you are a current student at the University of Oklahoma, you don\'t need to create an account. Log in with your OUNet ID (4+4).'
	},
	CONTACTINFO: {
		phone: '(405) 325-HELP',
		LINK1: {
			label: 'janux@ou.edu',
			link: 'mailto:janux@ou.edu'
		},
		LINK2: {
			label: 'Service Centers',
			link: 'http://www.ou.edu/content/ouit/help/personal.html'
		},
		GIFTSUPPORT: '<a href="mailto:historychannel@ou.edu">HistoryChannel@ou.edu</a>'
	},
	ENROLLMENT: {
		SUBSCRIBE: {
			label: 'Yes, I\'d like to sign up for HISTORY email updates.',
			legal: 'By opting in for email updates you agree to receive emails from HISTORY Channel and A+E Networks. ' +
						'You can withdraw your consent at any time. More Details: <a href="http://www.aenetworks.com/privacy" target="_blank">Privacy Policy</a> | ' +
						'<a href="http://www.aenetworks.com/terms" target="_blank">Terms of Use</a> | ' +
						'<a href="http://www.aenetworks.com/contact" target="_blank">Contact Us</a>'
		}
	},
	COMING_SOON: soon,
	LIBRARY: library
};
