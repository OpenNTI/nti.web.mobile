import React from 'react';
import Card from './Card';

export default React.createClass({
	displayName: 'Achievements',

	propTypes: {
		user: React.PropTypes.object.isRequired
	},


	componentDidMount () {
		let {user} = this.props;
		if (user) {
			user.getAchievements().then(achievements=> console.debug(achievements));
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
