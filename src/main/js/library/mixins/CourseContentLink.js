import {encodeForURI} from 'nti-lib-ntiids';
import {Mixins} from 'nti-web-commons';

export default {
	mixins: [Mixins.BasePath],

	courseHref (courseId, section) {
		let courseUrl = encodeForURI(courseId);
		let url = this.getBasePath() + 'course/' + courseUrl + '/';
		if (section) {
			url += section;
		}
		return url;
	}
};
