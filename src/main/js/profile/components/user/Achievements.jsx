import React from 'react';
import PropTypes from 'prop-types';
import Logger from '@nti/util-logger';
import {User} from '@nti/web-profiles';

import Card from '../Card';

const {ProfileCertificates} = User;

const logger = Logger.get('profile:components:user:Achievements');

export default class extends React.Component {
	static displayName = 'Achievements';

	static propTypes = {
		entity: PropTypes.object.isRequired
	};

	componentDidMount () {
		let {entity} = this.props;
		if (entity) {
			entity.getAchievements().then(achievements=> logger.debug(achievements));
		}
	}

	render () {
		return (
			<ul className="profile-cards">
				<Card className="achievements" title="Achievements">
					<ProfileCertificates entity={this.props.entity} showPreviewFrame={false}/>
				</Card>
			</ul>
		);
	}
}
