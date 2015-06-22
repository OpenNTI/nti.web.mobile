import React from 'react/addons';

import Avatar from './Avatar';
import DisplayName from './DisplayName';

import BasePathAware from '../mixins/BasePath';

import {join} from 'path';

/**
 * Renders the user session box (user's avatar, name, logout link, profile link)
 */
export default React.createClass({
	displayName: 'Session',
	mixins: [BasePathAware],

	propTypes: {
		username: React.PropTypes.string.isRequired,

		children: React.PropTypes.any
	},


	render () {
		let {children, username} = this.props;

		let base = this.getBasePath();

		let profile = join(base, 'profile', encodeURIComponent(username));

		return (
			<a className="user-session" href={profile}>
				<Avatar username={username}/>
				<div className="meta">
					<DisplayName username={username}/>
					<div>View Profile</div>
				</div>
				<div className="actions">
					{children}
				</div>
			</a>
		);
	}
});
