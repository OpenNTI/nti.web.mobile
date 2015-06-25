import React from 'react';
import Card from './Card';
export default React.createClass({
	displayName: 'Activity',

	render () {
		return (
			<ul className="profile-cards">
				<Card className="activity" title="Activity">...</Card>
			</ul>
		);
	}
});
