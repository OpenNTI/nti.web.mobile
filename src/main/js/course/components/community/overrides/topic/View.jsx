import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Registry from '../Registry';
import Topic from '../../../../../forums/components/TopicView';

import Styles from './View.css';

const cx = classnames.bind(Styles);
const handles = (obj) => obj && obj.isTopic;

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


	render () {
		const {topic, channel} = this.props;

		return (
			<div className={cx('forums-wrapper', 'community-topic')}>
				<Topic
					topicId={topic.getID()}
					forum={channel.backer}
					contextOverride={this.getContextOverride()}
					analyticsData={this.getAnalyticsData()}
				/>
			</div>
		);
	}
}