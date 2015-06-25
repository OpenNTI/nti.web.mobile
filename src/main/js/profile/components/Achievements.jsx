import React from 'react';
import Card from './Card';

export default React.createClass({
	displayName: 'Achievements',

	render () {
		return (
			<ul className="profile-cards">
				<Card className="achievements" title="Achievements">...</Card>
			</ul>
		);
	}
});
