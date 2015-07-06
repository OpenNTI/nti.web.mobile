import React from 'react';
import Card from '../Card';

export default React.createClass({
	displayName: 'Achievements',

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},


	componentDidMount () {
		let {entity} = this.props;
		if (entity) {
			entity.getAchievements().then(achievements=> console.debug(achievements));
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
