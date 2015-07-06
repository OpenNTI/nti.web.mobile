import React from 'react/addons';

import Avatar from 'common/components/Avatar';
import HeadSummary from './HeadSummary';

export default React.createClass({
	displayName: 'profile:Head',

	propTypes: {
		children: React.PropTypes.any,

		username: React.PropTypes.string.isRequired
	},

	render () {
		let {children, username} = this.props;

		username = decodeURIComponent(username);

		return (
			<div className="profile-head user-profile">
				<div className="user">
					<div className="profile-avatar-container">
						<Avatar username={username}/>
					</div>
					<HeadSummary username={username} />
				</div>
				{children}
			</div>
		);
	}
});
