import React from 'react/addons';

import {getAppUsername} from 'common/Utils';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import LogoutButton from 'login/components/LogoutButton';

export default React.createClass({
	displayName: 'profile:Head',

	render () {
		let {username} = this.props;

		let me = username === getAppUsername();

		return (
			<div className="profile-head">
				<div className="user">
					<Avatar username={username}/>
					<div className="label">
						<DisplayName username={username}/>
					</div>
				</div>
				<ul className="actions">
					{me && <li><LogoutButton/></li>}
				</ul>
			</div>
		);
	}
});
