import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {LinkTo} from '@nti/web-routing';

import Registry from '../Registry';
import Page from '../Page';
import CreateTopic from '../../../../forums/components/CreateTopic';

import Styles from './View.css';

const cx = classnames.bind(Styles);
const handles = obj => obj && obj.isNewTopic;

export default
@Registry.register(handles)
class NTIMobileCommunityNewTopic extends React.Component {
	static propTypes = {
		channel: PropTypes.shape({
			backer: PropTypes.object
		})
	}

	static contextTypes = {
		router: PropTypes.object
	}

	onTopicCreated = (topic) => {
		return LinkTo.Object.routeTo(this.context.router, topic);
	}

	render () {
		const {channel} = this.props;

		return (
			<Page {...this.props}>
				<div className={cx('community-new-topic-override')}>
					<CreateTopic forum={channel.backer} onTopicCreated={this.onTopicCreated} />
				</div>
			</Page>
		);
	}
}