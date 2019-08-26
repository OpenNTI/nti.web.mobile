import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Registry from '../Registry';
import Page from '../Page';
import Topic from '../../../../../forums/components/TopicView';

import Styles from './View.css';

const cx = classnames.bind(Styles);
const handles = (obj) => obj && obj.isTopic;

const CLEAN_PATH_REGEX = /^(.*)(discussions.*)$/g;

export default
@Registry.register(handles)
class NTIMobileCommunityTopic extends React.Component {
	static propTypes = {
		community: PropTypes.object,
		topic: PropTypes.object.isRequired,
		channel: PropTypes.object
	}

	static contextTypes = {
		router: PropTypes.object
	}

	static childContextTypes = {
		router: PropTypes.object
	}


	getChildContext () {
		return {
			router:  {
				...(this.context.router || {}),
				history: null
			}
		};
	}


	getContextOverride () {
		const {topic} = this.props;
		const {router} = this.context;

		return {
			href: router.makeHref(router.getPath().replace(/\/discussions.*$/g, '/')),
			label: topic && topic.title
		};
	}


	getAnalyticsData = () => {
		const {community} = this.props;
		const context = [
			community && community.getID()
		];

		return {
			context: context.filter(Boolean),
			rootContextId: community && community.getID()
		};
	}


	getExtraRouterProps = () => {
		const {router} = this.context;
		const {route} = router || {};
		const {location} = route || {};
		const {pathname} = location || {};

		if (!pathname) { return null; }

		return {
			path: pathname.replace(CLEAN_PATH_REGEX, '$2')
		};
	}


	render () {
		const {topic, channel} = this.props;

		return (
			<Page {...this.props}>
				<div className={cx('forums-wrapper', 'community-topic')}>
					<Topic
						topicId={topic.getID()}
						forum={channel.backer}
						contextOverride={this.getContextOverride()}
						analyticsData={this.getAnalyticsData()}
						extraRouterProps={this.getExtraRouterProps()}
					/>
				</div>
			</Page>
		);
	}
}