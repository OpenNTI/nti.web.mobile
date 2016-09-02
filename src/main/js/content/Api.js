import {getService} from 'nti-web-client';
import GENERATORS from './page-generators';


export function getPageInfo (ntiid, contextId) {
	//Temp fix...
	const params = contextId ? {course: contextId} : void 0;
	return getService()
		.then(service => {
			return service.getPageInfo(ntiid, params)
				.catch(error => error.statusCode === 405
						? generatePageInfoFrom(ntiid, service)
						: Promise.reject(error));
		});
}


function generatePageInfoFrom (ntiid, service) {
	return service.getObject(ntiid)
		.then(object => {
			const generator = GENERATORS[object.MimeType];
			if (!generator) {
				//continue the error
				return Promise.reject('405: Method Not Allowed');
			}

			return generator(service, object);
		});
}
