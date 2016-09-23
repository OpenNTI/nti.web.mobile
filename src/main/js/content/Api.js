import {getService} from 'nti-web-client';
import GENERATORS from './page-generators';


export function getPageInfo (ntiid, context) {
	//Temp fix...
	const params = context ? {course: context.getID()} : void 0;
	return getService()
		.then(service => {
			return service.getPageInfo(ntiid, {parent: context, params})
				.catch(error => error.statusCode === 405
						? generatePageInfoFrom(ntiid, service, context)
						: Promise.reject(error));
		});
}


function generatePageInfoFrom (ntiid, service, context) {
	const params = context ? {course: context.getID()} : void 0;

	return service.getObject(ntiid, {parent: context, params})
		.then(object => {
			const generator = GENERATORS[object.MimeType];
			if (!generator) {
				//continue the error
				return Promise.reject('405: Method Not Allowed');
			}

			return generator(service, context, object);
		});
}
