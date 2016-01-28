import React from 'react';
import Logger from 'nti-util-logger';
import Card from '../Card';

const logger = Logger.get('profile:components:user:Achievements');

export default React.createClass({
	displayName: 'Achievements',

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},


	componentDidMount () {
		let {entity} = this.props;
		if (entity) {
			entity.getAchievements().then(achievements=> logger.debug(achievements));
		}
	},

	render () {
		return (
			<ul className="profile-cards">
				<Card className="achievements" title="Achievements">...</Card>
			</ul>
		);
	}
});
