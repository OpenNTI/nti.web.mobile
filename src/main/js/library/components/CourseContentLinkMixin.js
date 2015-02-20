import {encodeForURI} from 'dataserverinterface/utils/ntiids';
import BasePathAware from 'common/mixins/BasePath';
export default {
	mixins: [BasePathAware],

	courseHref (courseId, withNav=true) {
		var courseUrl = encodeForURI(courseId);
		let url = this.getBasePath() + 'course/' + courseUrl + '/';
		if (withNav) {
			url += '#nav';
		}
		return url;
	}
};
