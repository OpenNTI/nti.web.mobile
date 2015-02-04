import {encodeForURI} from 'dataserverinterface/utils/ntiids';
import BasePathAware from 'common/mixins/BasePath';
export default {
	mixins: [BasePathAware],

	courseHref (courseId) {
		var courseUrl = encodeForURI(courseId);
		return this.getBasePath() + 'course/' + courseUrl + '/#nav';
	}
};
