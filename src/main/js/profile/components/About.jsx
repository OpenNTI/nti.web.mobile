import React from 'react';
import Loading from 'common/components/TinyLoader';

export default React.createClass({
	displayName: 'About',

	propTypes: {
		user: React.PropTypes.object.isRequired
	},

	render () {

		if (!this.props.user) {
			return <Loading />;
		}

		return (
			<ul className="profile-cards">
				<li className="profile-card about">About</li>
				<li className="profile-card education">Education</li>
				<li className="profile-card professional">Professional</li>
			</ul>
		);
	}
});
