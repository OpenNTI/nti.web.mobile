import React from 'react';
import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';
import Avatar from 'common/components/Avatar';

export default React.createClass({
	displayName: 'Joined',

	propTypes: {
		user: React.PropTypes.object.isRequired
	},

	render () {
		let {user} = this.props;
		return (
			<div className="joined avatar-heading">
				<Avatar user={user} />
				<div className="wrap">
					<h1><DisplayName user={user} /> joined NextThought!</h1>
					<div className="meta"><DateTime date={user.getCreatedTime()} /></div>
				</div>
			</div>
		);
	}
});
