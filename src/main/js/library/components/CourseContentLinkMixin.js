import {encodeForURI} from 'dataserverinterface/utils/ntiids';
import BasePathAware from 'common/mixins/BasePath';

export default {
	mixins: [BasePathAware],

	courseHref (courseId, section) {
		var courseUrl = encodeForURI(courseId);
		let url = this.getBasePath() + 'course/' + courseUrl + '/';
		if (section) {
			url += section;
		}
		return url;
	}
};
