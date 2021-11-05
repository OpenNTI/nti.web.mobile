/*eslint import/no-commonjs:0*/
// const {
// 	// Catalog,
// 	Library,
// 	// Notifications
// } = require('@nti/lib-interfaces');

const needsAttention = route => Promise.reject({ isLoginAction: true, route });

export function sessionSetup(service) {
	return (
		service
			.getAppUser()

			.then(user => {
				if (user.acceptTermsOfService) {
					// console.debug('User needs to accept terms of service.');
					return needsAttention('onboarding/tos');
				}
				return user;
			})

			.then(user => {
				if (user.hasLink('RegistrationSurvey')) {
					// console.debug('User needs to submit registration survey.');
					return needsAttention('onboarding/survey');
				}

				return user;
			})

			.then(user => {
				if (user.hasLink('user_profile_update')) {
					// console.debug('User needs to update their profile');
					return needsAttention('onboarding/update');
				}
			})

			//TODO: Add More Login Actions HERE.

			.then(() =>
				Promise.all([
					service,
					// Library.load(service, 'Main'),
					// Catalog.load(service),
					// Notifications.load(service)
				])
			)
	);
}
