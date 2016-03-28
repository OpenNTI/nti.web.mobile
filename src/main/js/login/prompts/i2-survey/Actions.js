import {getService} from 'common/utils';

const SUBMIT_REGISTRATION = 'SubmitRegistration';

export function submitSurvey (data) {
	return getService().then(service => {
		service.getAppUser().then(user => {
			const link = user.getLink(SUBMIT_REGISTRATION);
			if(!link) {
				return Promise.reject(`No ${SUBMIT_REGISTRATION} link`);
			}
			return service.post(link, data);
		});
	});
}
