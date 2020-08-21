import './Achievements.scss';
import React from 'react';
import PropTypes from 'prop-types';
import Logger from '@nti/util-logger';
import {User} from '@nti/web-profiles';
import {getAppUser} from '@nti/web-client';
import {Loading} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Card from '../Card';

const t = scoped('nti-web-mobile.profile.components.user.Achievements', {
	noCertificates: 'This user doesn\'t have any visible badges or certificates.'
});


const {ProfileCertificates} = User;

const logger = Logger.get('profile:components:user:Achievements');

export default class extends React.Component {
	static displayName = 'Achievements';

	static propTypes = {
		entity: PropTypes.object.isRequired
	};

	state = {}

	componentDidMount () {
		let {entity} = this.props;
		if (entity) {
			entity.getAchievements().then(achievements=> logger.debug(achievements));
		}

		getAppUser().then(user => {
			this.setState({actingUser: user});
		});
	}

	renderEmptyMessage () {
		return <div className="empty-state">{t('noCertificates')}</div>;
	}

	render () {
		const {actingUser} = this.state;
		const {entity} = this.props;

		if(!actingUser || !entity) {
			return <Loading.Ellipsis/>;
		}

		const isMe = actingUser.Username === entity.Username;

		return (
			<ul className="profile-cards">
				<Card className="achievements" title="Achievements">
					{isMe && <ProfileCertificates entity={entity} showPreviewFrame={false}/>}
					{!isMe && this.renderEmptyMessage()}
				</Card>
			</ul>
		);
	}
}
