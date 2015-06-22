import React from 'react/addons';

import {getAppUsername} from 'common/utils';

import Avatar from 'common/components/Avatar';
import HeadSummary from './HeadSummary';

import LogoutButton from 'login/components/LogoutButton';

export default React.createClass({
	displayName: 'profile:Head',

	propTypes: {
		username: React.PropTypes.string.isRequired
	},

	render () {
		let {username} = this.props;

		username = decodeURIComponent(username);

		let me = username === getAppUsername();

		return (
			<div className="profile-head">
				<div className="user">
					<Avatar username={username}/>
					<HeadSummary username={username} />
				</div>
				<ul className="actions">
					{me && <li><LogoutButton/></li>}
				</ul>
			</div>
		);
	}
});
