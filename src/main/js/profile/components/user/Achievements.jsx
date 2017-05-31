import PropTypes from 'prop-types';
import React from 'react';
import Logger from 'nti-util-logger';
import Card from '../Card';

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
				<Card className="achievements" title="Achievements">...</Card>
			</ul>
		);
	}
}
