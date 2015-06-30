import {getService} from 'common/utils';

export function getTopicBreadcrumb(topicId) {
	return getService()
	.then(
		service => service.getContextPathFor(topicId)
	);
}
