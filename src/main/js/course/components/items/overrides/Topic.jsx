import React from 'react';
import PropTypes from 'prop-types';

import Topic from 'internal/forums/components/TopicView';

import Page from './Page';
import Registry from './Registry';

function getTopicId(location) {
	const { item } = location || {};

	return item && item.target;
}

const MIME_TYPES = {
	'application/vnd.nextthought.discussionref': true,
	'application/vnd.nextthought.discussion': true,
};
const handles = obj => {
	const { location } = obj || {};
	const { item } = location || {};

	return item && MIME_TYPES[item.MimeType];
};

export default class CourseItemDiscussion extends React.Component {
	static propTypes = {
		location: PropTypes.object,
		course: PropTypes.object,
		lessonInfo: PropTypes.object,
	};

	static contextTypes = {
		router: PropTypes.object,
	};

	getContextOverride() {
		const { location } = this.props;
		const { router } = this.context;

		return {
			href: router.makeHref(
				router.getPath().replace(/\/discussions.*$/g, '/')
			),
			label: location && location.item && location.item.title,
		};
	}

	getAnalyticsData = () => {
		const { course, lessonInfo } = this.props;
		const context = [
			course && course.getID(),
			lessonInfo && lessonInfo.outlineNodeId,
		];

		return {
			context: context.filter(Boolean),
			rootContextId: course && course.getID(),
		};
	};

	render() {
		const { location } = this.props;
		const topicId = getTopicId(location);

		return (
			<Page {...this.props}>
				<div className="forums-wrapper">
					<Topic
						topicId={topicId}
						contextOverride={this.getContextOverride()}
						analyticsData={this.getAnalyticsData()}
					/>
				</div>
			</Page>
		);
	}
}

Registry.register(handles)(CourseItemDiscussion);
