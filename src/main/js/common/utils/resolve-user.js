import {getService} from './';

export default function resolveUser (props) {
	let username = props.username;
	let user = props.user;
	let promise;

	if (!username && !user) {
		promise = Promise.reject('No User or no Username');
	}

	promise = promise || (user && Promise.resolve(user));

	if (!promise) {
		promise = getService()
			.then(service=>service.resolveUser(decodeURIComponent(username)));
	}

	return promise;
}
