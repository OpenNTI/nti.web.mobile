import React from 'react/addons';

import Avatar from 'common/components/Avatar';
import HeadSummary from './HeadSummary';

export default React.createClass({
	displayName: 'profile:Head',

	propTypes: {
		username: React.PropTypes.string.isRequired
	},

	render () {
		let {username} = this.props;

		username = decodeURIComponent(username);

		return (
			<div className="profile-head">
				<div className="user">
					<Avatar username={username}/>
					<HeadSummary username={username} />
				</div>
			</div>
		);
	}
});
