import {encodeForURI} from 'nti-lib-ntiids';
import BasePathAware from 'common/mixins/BasePath';

export default {
	mixins: [BasePathAware],

	courseHref (courseId, section) {
		let courseUrl = encodeForURI(courseId);
		let url = this.getBasePath() + 'course/' + courseUrl + '/';
		if (section) {
			url += section;
		}
		return url;
	}
};
