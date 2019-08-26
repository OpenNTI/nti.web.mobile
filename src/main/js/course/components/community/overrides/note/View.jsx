import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Registry from '../Registry';
import Page from '../Page';

import Styles from './View.css';
import Note from './Note';

const cx = classnames.bind(Styles);
const handles = (obj) => obj && obj.isNote;

const cleanPath = (path) => {
	const parts = path.split('/');
	const communityPartIndex = parts.indexOf('community');

	//Replace the channel id and topic id parts of the route
	return parts.slice(communityPartIndex + 3).join('/') || '/';
};

export default
@Registry.register(handles)
class NTIMobileCommunityTopic extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		community: PropTypes.object,
		topic: PropTypes.object.isRequired,
		channel: PropTypes.object,
	}

	static contextTypes = {
		router: PropTypes.object
	}

	static childContextTypes = {
		router: PropTypes.object
	}


	getChildContext () {
		return {
			router: {
				...(this.context.router || {}),
				history: null
			}
		};
	}


	getExtraRouterProps = () => {
		const {router} = this.context;
		const {route} = router || {};
		const {location} = route || {};
		const {pathname} = location || {};

		if (!pathname) { return null; }

		return {
			path: cleanPath(pathname)
		};
	}


	render () {
		const {topic, channel} = this.props;

		return (
			<Page {...this.props}>
				<div className={cx('community-note-override')}>
					<Note
						note={topic}
						channel={channel}
						extraRouterProps={this.getExtraRouterProps()}
					/>
				</div>
			</Page>
		);
	}
}